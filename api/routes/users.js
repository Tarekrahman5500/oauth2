import express from 'express';
import User from '../model/users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router();
import sendEmail from '../controllers/sendmail'
import auth from '../controllers/auth'
import authAdmin from '../controllers/authAdmin'
// de structure the files
const {ACTIVATION_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CLIENT_URL} = process.env

// create token for new user
const createActivationToken = (payload) => {
    return jwt.sign(payload, ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}
// create token for use the application
const createAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}
// refresh the token for next use
const createRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

/* GET users listing. */
router.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!email || !name || !password) return res.status(404).json({message: "Fill all fields"})
        // validate the mail
        if (!validateEmail(email)) return res.status(404).json({message: "Invalid email"})

        const user = await User.findOne({email})
        if (user) return res.status(404).json({message: "email already in use"})
        if (password.length < 6) return res.status(404).json({message: "Password must be at least 6 characters"})
        // make hash the password
        const passwordHash = await bcrypt.hash(password, 16)
        // console.log({password, passwordHash})
        const newUser = {name, email, password: passwordHash}
        // generate the token
        const activation_token = createActivationToken(newUser)
        // define the url in mail to click
        const url = `${CLIENT_URL}/user/activate/${activation_token}`
        // call the mail send function
        sendEmail(email, url, 'verify your email')
        console.log({activation_token})
        res.json({message: 'Registration Successfully, Please Verify Your Email'})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

router.post('/activation', async (req, res) => {
    try {
        // get the activation code
        const {activation_token} = req.body;
        // verify the code
        const user = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET)
        console.log(user)
        const {name, email, password} = user
        // check the email is existed
        const check = await User.findOne({email})
        if (check) return res.status(404).json({message: "email already in use"})
        // email is new then create new account
        const newUser = new User({name, email, password})
        // save the user
        await newUser.save()
        res.json({success: true, message: "Account has been activated"})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

router.post('/login', async (req, res) => {
    try {
        // get mail and pass
        const {email, password} = req.body
        // check mail is present or not
        const user = await User.findOne({email})
        if (!user) return res.status(404).json({message: `User with email ${email} not found`})
        // check password is correct or not by using bcrypt
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(404).json({message: `Invalid password`})
        // if all ok then create RefreshToken for use app
        const refresh_token = createRefreshToken({id: user._id})
        // for 7 days save in cookie
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            path: 'users/refresh_token',
            maxAge: 7 * 24 * 3600 * 1000 // 7 days
        })
        return res.status(200).json({success: true, message: "Welcome", user, refresh_token})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

router.post('/refresh_token', async (req, res) => {
    try {

        // get the token from cookie for refresh_token
        const rf_token = req.cookies.refresh_token
        // verify token
        if (!rf_token) return res.status(403).json({message: 'You have to be logged in'})
        // decode and check
        jwt.verify(rf_token, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({message: 'You have to be logged in'})
            const access_token = createAccessToken({id: user.id})
            return res.status(200).json({user, access_token})

        })

    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

router.post('/forgot', async (req, res) => {
    try {
        // get the mail
        const {email} = req.body
        // find it in db
        const user = await User.findOne({email})
        if (!user) return res.status(404).json({message: `User with email ${email} not found`})
        // create access token for change password
        const access_token = createAccessToken({id: user._id})
        const url = `${CLIENT_URL}/user/reset/${access_token}`
        // send mail
        sendEmail(email, url, 'Reset Your Password')
        console.log(access_token)
        return res.status(200).json({message: `Check your email`})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

router.post('/reset', auth, async (req, res) => {
    try {
        // after auth the user get pass and hash it
        const {password} = req.body
        const passwordHash = await bcrypt.hash(password, 16)
        // console.log(req.user)
        // update pass
        await User.findOneAndUpdate({_id: req.user.id}, {
            password: passwordHash,
        })
        return res.status(200).json({message: `Your password has been updated`})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

// get a user info
router.get('/info', auth, async (req, res) => {
    try {
        // find a single user
        const user = await User.findById(req.user.id).select('-password')
        return res.status(200).json({user})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

// get all user info
router.get('/all_info', auth, authAdmin, async (req, res) => {
    try {
        // find all user without pass
        const user = await User.find().select('-password')
        return res.status(200).json({user})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

//logout
router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('refresh_token', {path: 'users/refresh_token'})
        return res.status(200).json({message: 'Successfully logged out'})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})
// update user info
router.patch('/update', auth, async (req, res) => {
    try {
        const {name, avatar} = req.body
        // find the user
        await User.findOneAndUpdate({_id: req.user.id}, {name, avatar})
        return res.status(200).json({message: 'Successfully Update'})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})
//update all by admin

router.patch('/update_role/:id', auth, authAdmin, async (req, res) => {
    try {
        const {role} = req.body
        // find the user
        await User.findOneAndUpdate({_id: req.params.id}, {role})
        return res.status(200).json({message: 'Successfully Update'})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

//delete account by user
router.delete('/delete', auth, async (req, res) => {
    try {
        // find the user
        await User.findByIdAndDelete({_id: req.user.id})
        return res.status(200).json({message: 'Successfully Delete'})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})

// delete by admin
router.delete('delete/:id', auth, authAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete({_id: req.params.id})
        return res.status(200).json({message: 'Successfully Delete'})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
})
// check valid mail
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

module.exports = router;
