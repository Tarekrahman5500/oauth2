import express from 'express';
import uploadImage from '../controllers/uploadImage'
import {v2 as cloudinary} from 'cloudinary';

const router = express.Router();
import auth from '../controllers/auth'
import fs from "fs";

const {CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET} = process.env

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
})

router.post('/upload_avatar', uploadImage, auth, async (req, res, next) => {
    try {
        const file = req.files.file
        await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'avatar', width: '150', height: '150', crop: 'fill'
        },(err, result) => {
           if (err) throw err;
           removeTmp(file.tempFilePath)
            return res.status(200).json({url: result.secure_url});
        })

    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = router;
