import express from 'express';
import path from 'path'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from "cors";
import fileUpload from 'express-fileupload'
import 'dotenv/config'

const app = express();

const port = process.env.PORT || 5000
import indexRouter from './routes/index'
import usersRouter from './routes/users'
import mongoose from "mongoose";
app.use(cors())
app.options('*', cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// file upload
app.use(fileUpload({useTempFiles: true}));
app.use(express.static(path.join(__dirname, 'public')));


(async () => {
    try {
        await mongoose.set('strictQuery',true);
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'oauth-database'
        })
        console.log('MongoDB connected');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
})().catch(console.dir)

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})


module.exports = app;
