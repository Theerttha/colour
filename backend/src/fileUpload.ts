import multer, { diskStorage } from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req:Express.Request, file:Express.Multer.File, callback: (error: Error | null, destination: string)=>void) {
        callback(null, "uploads");
    },
    filename: function (req:Express.Request, file:Express.Multer.File, callback: (error: Error | null, destination: string)=>void) {
        callback(null, Date.now() + path.extname(file.originalname));
    },
 
});
console.log(storage);
const upload = multer({ storage: storage });

export default upload;