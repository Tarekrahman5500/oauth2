import jwt from 'jsonwebtoken'
import User from '../model/users'

const authAdmin = async (req, res, next) => {
    try {
           const user = await User.findOne({_id: req.user.id})
        // check user has admin power or not
        if (user.role !== 1) return res.status(500).json({message: 'You are not allowed to access this operation'});
        next();
    } catch (err) {
         return res.status(500).json({error: err.message});
    }
}

module.exports = authAdmin