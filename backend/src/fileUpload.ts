import multer, { diskStorage } from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
 
});
console.log(storage);
const upload = multer({ storage: storage });

export default upload;