import multer from 'multer';

import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const username=process.env.DB_USERNAME;
const password= process.env.DB_PASSWORD;

const storage =new GridFsStorage({
    db: mongoose.connection.db,
    // options:{useNewUrlParser:true},
    file:(request,file) =>{
        const match=["image/png","image/jpg"];

        if(match.indexOf(file.mimeType) === -1)
            return `${Date.now()}-blog-${file.originalname}`;
        
        return{
            bucketName:"photos",
            filename:`${Date.now()}-blog-${file.originalname}`
        }
    }

});

export default multer({ storage });
