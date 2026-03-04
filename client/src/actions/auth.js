import axiosInstance, { countriesAPI } from "../API/axios"


export const login = async (values) => {

    const {data} = await axiosInstance.post('/user/login', values);       
    return data;

}

export const checkEmailValidity = async(email) =>{
    const {data} = await axiosInstance.get('/user/validate', {
        params: {email}
    });

    return data?.available
}

export const register = async(values) =>{    
    const {data} = await axiosInstance.post('/user/register', values)
    return data;
}

export const getUserAuth = async() =>{
    const data = axiosInstance.get('/user/auth');
    return data;
}

export const countriesList = async() =>{
    const {data} = await countriesAPI.get("/all?fields=name,idd,cca2,flags")
    return data; 
}


export const resetPassword = async(values, token) =>{

    const {data} = await axiosInstance.post(`/profile/reset-password/${token}`, values);

    return data;
}

export const resetPasswordEmail = async(email) =>{
    await axiosInstance.post('/profile/reset-password', {email})
}

// export const uploadProfilePicture = async(req, res) =>{

// }



// export const resetPaassword = async(email) =>{
//     const {data} = await axiosInstance.post('/user/reset-password', email)

//     return data
// }






//use later
export const googleLogin = async(googleToken) =>{

    const {data} = await axiosInstance.post('/user/google', {
        token: googleToken
    });
    console.log(data)
    return data;
}

export const completeGoogleProfile = async(values) =>{
    const {data} = await axiosInstance.put('/user/complete-profile', values)

    return data;
}

export const uploadPicture = async(formaData) =>{
    const {data} = await axiosInstance.post('/profile/picture', formaData, {
        headers:{
            "Content-Type": "multipart/form-data"
        }
    });

    return data;
}


