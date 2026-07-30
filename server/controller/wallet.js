import mongoose from "mongoose";
import { getResend } from "../config/resend.js";
import User from "../models/user.js";
import WalletTransaction from "../models/Wallet.js";


export const addFunds= async(req, res) =>{
    try {

        const userId = req.user._id;

        const {amount, method} = req.body;

        const admin = await User.findOne({role: 'admin', isActive: true,  receivesPayment: true})
                                    .select('role receivesPayment name lastname phone email')

        const user = await User.findById(userId).select('name lastname email')

        if(!admin) return res.status(400).json({
            ok: false,
            message: 'Admin not available to recieve payments'
        });

        //evitar multiples pending deposits
        const existingPending = await WalletTransaction.findOne({
            user: userId,
            type: 'deposit',
            status: 'pending'
        });

        if(existingPending) return res.status(400).json({
            ok: false,
            message: 'You already have a pending deposit'
        });

        const transaction = await WalletTransaction.create({
            user: userId,
            amount,
            type: "deposit",
            status: "pending",
            method, 
            assignedAdmin: admin._id
        })

        const refUrlAdmin = `${process.env.FRONTEND_URL}/admin/transactions`

        const resend = getResend();

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: admin.email,
            subject: '[MTC ACTION REQUIRED] Wallet funds',
            html: `
                <h2>${user.name} has requested to add funds</h2>
                <p>${user.email} has requested to add ${amount}€ to his wallet funds</p>   
                <a href='${refUrlAdmin}'>To confirm or decline the request please click here</a> 
            `
        });

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'MTC - Add funds request',
            html: `
                <h2>Hello ${user.name},</h2>
                <p>Your request to add ${amount}€ to your wallet has been sent once your request is processed you will be notified by email</p> 
                <p>Best regards,</p>  
                 
            `
        });

        return res.status(201).json({
            message: "Funds have been sent to your account",
            transaction
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error adding funds'
        })
    }
}

export const confirmDeposit = async(req, res) =>{
    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const adminId = req.user._id;
        const {id} = req.params;
        const {note} = req.body;

        const transaction = await WalletTransaction.findById(id).session(session);

        const user = await User.findById(transaction.user);


        if(!transaction){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Transaction not found'
            });
        }

        if(transaction.type !== 'deposit'){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Invalid transaction type'
            });
        }         

        if(transaction.status !== 'pending'){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Transaction already processed'
            });
        }

        //solo admin asignado
        if(transaction.assignedAdmin.toString() !== adminId.toString()){
            await session.abortTransaction()
            return res.status(400).json({
                ok: false,
                message: 'You are not authorized to confirm this transaction'
            });
        }

        //confirmed transaction update
        transaction.status = "confirmed";
        transaction.note = note;
        transaction.reviewedBy = adminId;
        transaction.reviewedAt = new Date()


        await transaction.save({session});

        //update funds
        await User.findByIdAndUpdate(
            transaction.user,
            {$inc: {walletBalance: transaction.amount}},
            {session}
        );

        await session.commitTransaction();
        session.endSession();     

        const resend = getResend();

        const refUrl = `${process.env.FRONTEND_URL}/wallet`
        

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'MTC - Funds added to your account',
            html: `
                <h2>Hello ${user.name},</h2>
                <p>${transaction.amount}€ has been added to your wallet</p> 
                <p><a href="${refUrl}">Click here to check your account</a></p>
                <p>Best regards,</p>  
                 
            `
        });

        return res.status(200).json({
            message: 'Transaction completed successfully'
        });


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error confirming funds'
        })
    }
}


export const rejectDeposit = async(req, res) =>{
    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const adminId = req.user._id;
        const {id} = req.params;
        const {note} = req.body;

        const transaction = await WalletTransaction.findById(id).session(session);

        const user = await User.findById(transaction.user);


        if(!transaction){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Transaction not found'
            });
        }

        if(transaction.type !== 'deposit'){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Invalid transaction type'
            });
        }         

        if(transaction.status !== 'pending'){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Transaction already processed'
            });
        }

        //solo admin asignado
        if(transaction.assignedAdmin.toString() !== adminId.toString()){
            await session.abortTransaction()
            return res.status(400).json({
                ok: false,
                message: 'You are not authorized to confirm this transaction'
            });
        }

        //confirmed transaction update
        transaction.status = "rejected";
        transaction.note = note;
        transaction.reviewedBy = adminId;
        transaction.reviewedAt = new Date()


        await transaction.save({session});

        await session.commitTransaction();
        session.endSession();     

        const resend = getResend();


        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'MTC - Transaction rejected',
            html: `
                <h2>Hello ${user.name},</h2>
                <p>Your request to add ${transaction.amount}€ to your wallet has been rejected</p> 
                <p>Reason: ${transaction.note}</p>
                <p>Please contact administrator to review your transaction</p>
                <p>Best regards,</p>                   
            `
        });

        return res.status(200).json({
            message: 'Transaction completed successfully'
        });


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error confirming funds'
        })
    }
}

export const pendingDeposits = async(req, res) =>{
    try {

        const adminId = req.user._id;

        const transactions = await WalletTransaction.find({
            type: 'deposit',
            status: 'pending',
            assignedAdmin: adminId
        }).populate("user", "name lastname email phone")
        .sort({createdAt: -1})

        return res.status(200).json(transactions)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining transactions'
        })
    }
}

export const allDeposits = async(req, res) =>{
    try {

        //const adminId = req.user._id;

        const transactions = await WalletTransaction
                .find({createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }})
                .populate("user", "name lastname email phone")
        .sort({createdAt: -1})

        return res.status(200).json(transactions)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining transactions'
        })
    }
}

export const userDeposits = async(req, res) =>{
    try {

        const userId = req.user._id;

        const transaction = await WalletTransaction.find({user: userId})
                                    .select('type amount method status createdAt reviewdAt note')
                                    .populate('assignedAdmin', "name lastname")

        
        if(!transaction) return res.status(400).json({
            ok: false,
            message: 'Transaction not found'
        })

        return res.status(200).json(transaction)

        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining transactions'
        })
    }
}

export const refundAdjustments = async(req, res) =>{

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const adminId = req.user._id;

        const {userId, amount, type, note} = req.body;

        const amountNumber = Number(amount);

        if (!userId || !type || isNaN(amountNumber) || amountNumber <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'User, amount and type are required'
            });
        }        

        if(!userId || !amountNumber || !type){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'User amount and type are required'
            })
        }

        if(!['refund', 'adjustment'].includes(type)){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Please select a valid type (refund or adjustment)'
            })
        }

        const user = await User.findById(userId).session(session);

        if(!user){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            })
        }

         /*
        ==========================================
        CREATE TRANSACTION
        ==========================================
        */

        const transaction = await WalletTransaction.create([{
            user: userId,
            amount: amountNumber,
            type,
            status: 'confirmed',
            reviewedBy: adminId,
            reviewedAt: new Date(),
            note
        }], {session});

        /*
        ==========================================
        UPDATE BALANCE
        ==========================================
        */

        let balanceUpdate = 0;

        if(type === 'refund'){
            balanceUpdate = amountNumber;
        }

        if(type === 'adjustment'){
            balanceUpdate = -amountNumber;
        }

        await User.findByIdAndUpdate(
            userId,
            {$inc: {walletBalance: balanceUpdate}},
            {session}
        );

        await session.commitTransaction();
        
        session.endSession();

         /*
        ==========================================
        EMAIL
        ==========================================
        */

        const resend = getResend();

        const refUrl = `${process.env.FRONTEND_URL}/wallet`;

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: `MTC - ${type === 'refund' ? 'Refund processed' : 'Balance adjustment'}`,
            html: `
                <h2>Hello ${user.name},</h2>
                <p>A${type === 'adjustment' && 'n'} ${type} has been applied to your wallet</p>
                <p>Reason: ${note} || 'No details'</p>
                <p><a href="${refUrl}">Check your wallet</a></p>
                <p>Best regards,</p>
            `
        });

        return res.status(200).json({
            message: `${type} has been processed`,
            transaction: transaction[0]        })        


        
    } catch (error) {
        console.log(error)
         return res.status(400).json({
                ok: false,
                message: 'Internal error refunding/adjusting user'
        })
    }
}

export const addFundsUser = async(req, res) =>{
    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const adminId = req.user._id;
        const {id} = req.params;
        const {amount, method, note} = req.body;

        const amountNumber = Number(amount);

        if (!id || isNaN(amountNumber) || amountNumber <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'User, amount  are required'
            });
        }        

        if(!id || !amountNumber || !method){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'User amount, method  are required'
            })
        }

        const user = await User.findById(id).session(session);

        if(!user){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            })
        }
         /*
        ==========================================
        CREATE TRANSACTION
        ==========================================
        */

        const transaction = await WalletTransaction.create([{
            user: id,
            amount: amountNumber,
            method,
            type: 'deposit',
            status: 'confirmed',
            reviewedBy: adminId,
            reviewedAt: new Date(),
            note
        }], {session});

        /*
        ==========================================
        UPDATE BALANCE
        ==========================================
        */   

        await User.findByIdAndUpdate(
            id,
            {$inc: {walletBalance: amountNumber}},
            {session}
        );

        await session.commitTransaction();
        
        session.endSession();
 
        return res.status(200).json({
            message: `Desposit has been processed`,
            transaction: transaction[0]        })        


        
    } catch (error) {
        console.log(error)
         return res.status(400).json({
                ok: false,
                message: 'Internal error refunding/adjusting user'
        })
    }
}