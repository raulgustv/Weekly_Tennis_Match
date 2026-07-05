import axios from "axios";

export const urlShortener = async(req, res) => {
    try {
        let {longUrl} = req.body;

        if(!longUrl){
            res.status(500).json({
                ok: false,
                message: "URL is is required"
            })
        }

        if (!/^https?:\/\//i.test(longUrl)) {
            longUrl = `https://${longUrl}`;
        }


        new URL(longUrl);

        //bitly
        const response = await axios.post(
            "https://api-ssl.bitly.com/v4/shorten",
            {
                long_url: longUrl
            },{
                headers: {
                    Authorization: `Bearer ${process.env.BITLY_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        )

        return res.status(200).json({
            shortUrl: response.data.link
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Internal server error shortening URL"
        })
    }
}

