import fs from 'fs';


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}
module.exports = async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({message: 'No files uploaded'});
        const file = req.files.file
      //  console.log(file)
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({message: 'size too large'});
        }
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({message: 'image is not a JPEG or PNG file'});
        }
        next()

    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}