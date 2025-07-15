import express, { Request, Response } from 'express';
import cors from 'cors';

import upload from './fileUpload';
import path from 'path';
const app = express();

app.use(express.json());
app.use(cors());
const port=3000;
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.get('/', (req: Request, res: Response) => {
    res.send('Hell World!');
})
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
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