import jwt from 'jsonwebtoken'
// before reset
const auth = async (req, res, next) => {
    try {
        // check the access token is correct or not
        const token = req.header("Authorization");
        if (!token) return res.status(400).json({message: 'Invalid Authentication'});
        // decode the token if ok then can chane the pass
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({message: 'Invalid Authentication'})
            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}

module.exports = auth