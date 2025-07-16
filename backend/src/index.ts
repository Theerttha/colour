import express, { Request, Response } from 'express';
import cors from 'cors';
import upload from './fileUpload';
import path from 'path';
const app = express();

app.use(express.json());
app.use(cors());
const port=3000;
app.use('', express.static(path.join(process.cwd(), '')));
app.get('/hehe', (req: Request, res: Response) => {
    res.send('Hello World!');
})
app.post('', upload.single('file'), (req: Request, res: Response) => {
    console.log(req.file);
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
  });
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});