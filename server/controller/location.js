import slugify from "slugify";
import Location from "../models/Location.js"

export const newLocation = async(req, res) =>{
    try {

        const {name, address, courts} = req.body;


        const courtsArray = Array.from(
            {length: courts},
            (_, i) =>({
                number: i + 1
            })
        )

        //slug 
        let slug = slugify(name,{
            lower: true,
            strict: true
        });     

        const courtExists = await Location.findOne({slug});
        
        if(courtExists) return res.status(400).json({
            ok: false,
            message: 'Court already exists'
        })

        

        const location = await Location.create({
            name,
            slug, 
            address,
            courts: courtsArray
        });

        res.status(201).json(location)        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: 'false',
            message: 'Internal server error', error
        })
    }
}

export const getAllLocations = async(req, res) =>{
    try {
        const locations = await Location.find()

        res.status(201).json(locations)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Internal server error retrieving courts",
            error
        })
    }

}

export const getLocation = async(req, res) =>{
    try {
        const location = await Location.findOne({
            slug: req.params.slug,
            active: true
        })

        

        if(!location) return res.status(404).json({
            ok: false,
            message: "Location not found"
        })

        return res.status(201).json(location)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: "Internal server error obtaining location",
            error
        })
    }
}

export const favoriteLocation = async(req, res) =>{
    try {
        const location = await Location.findOne({
            slug: req.params.slug
        })

        if(!location) return res.status(400).json({
            ok: false,
            message: 'Location not found'
        });

        if(!location.active) return res.status(400).json({
            ok: false,
            message: 'Cannot favorite an inactive location'
        });

        location.favorite = !location.favorite;

        location.save();

        return res.status(200).json({
            favorite: location.favorite,
            location
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error toggling favorite'
        });

    }
}

export const toggleActivation = async(req, res) =>{
    try {
        const location = await Location.findOne({
            slug: req.params.slug
        })

        if(!location) return res.status(400).json({
            ok: false,
            message: 'Location not found'
        });    

        location.active = !location.active;

        location.save();

        return res.status(200).json({
            active: location.active,
            location
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error toggling court status'
        });

    }
}

export const updateCourtSuface = async(req, res) =>{
    try {
        const {slug} = req.params;
        const {courtNumber, surface} = req.body;

        const allowedSurfaces = ['Quick', 'Hard', 'Clay', 'Grass'];

        if(!allowedSurfaces.includes(surface)){
             return res.status(400).json({
                ok: false,
                message: `${surface} is not a valid selection`
            });
        }
        

        const location = await Location.findOneAndUpdate(
            {
                slug: slug,
                "courts.number": courtNumber
            },{
                $set: {
                    "courts.$.surface": surface
                }
            }, {new: true}
        );

        if(!location.active){
            return res.status(400).json({
                ok: false,
                message: `Location is currently inactive`
            });
        }

        if(!location){
            return res.status(400).json({
                ok: false,
                message: 'Location or court not found'
            });
        }

        return res.status(200).json(location)
        
    } catch (error) {
         console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error updating court surface'
        });
    }
}

export const toggleFavoriteCourt = async(req, res) =>{
    try {

        const {slug, courtNumber} = req.params;

        const location = await Location.findOne({slug});

        if(!location) return res.status(404).json({
            ok: false,
            message: 'Location not found'
        });

        const court  = location.courts.find(
            court => court.number === Number(courtNumber)
        )

        if(!court) return res.status(404).json({
            ok: false,
            message: 'Court does not exist or not found'
        });

        court.favorite = !court.favorite;

        await location.save();

        return res.status(200).json({
            ok: true,
            message: `Court ${courtNumber} has been ${court.favorite ? 'marked as favorite' : 'Removed from favorites'}`
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error adding court to favorite'
        });
    }
}

