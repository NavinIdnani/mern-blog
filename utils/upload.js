import multer from 'multer';

import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';


dotenv.config();

const username=process.env.DB_USERNAME;
const password= process.env.DB_PASSWORD;

const mongoUri=process.env.MONGODB_URI;

const storage =new GridFsStorage({
    // options:{useNewUrlParser:true},
    url:mongoUri,
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
