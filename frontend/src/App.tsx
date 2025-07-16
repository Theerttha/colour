import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const URL = import.meta.env.BACKEND_URL || 'http://localhost:3000/upload';
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [pixelRGB, setPixelRGB] = useState<string | null>(null);
  const [pixelHex, setPixelHex] = useState<string | null>(null);





  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setName(data.path);
  };

  useEffect(() => {
    if (!name) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `http://localhost:3000${name}`;

    img.onload = () => {
      const width = 300;
      const height = (img.height * width) / img.width;

      canvas!.width = width;
      canvas!.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      ctxRef.current = ctx;
      setImgLoaded(true);
    };
  }, [name]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgLoaded) return;

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const ctx = ctxRef.current;
      if (!ctx) return;

      try {
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        const rgb = `rgb(${r}, ${g}, ${b})`;
        const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
        setPixelRGB(rgb);
        setPixelHex(hex);

      } catch (err) {
        console.error("Canvas is tainted due to CORS.", err);
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [imgLoaded]);

  return (
    <>
    <h1 className='title'>HUE</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="file" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>

      <div className="imageDiv">
        <canvas ref={canvasRef} />
      </div>
      {pixelRGB && pixelHex && (
      <div className="color-info">
        <div
          className="color-swatch"
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: pixelRGB,
            border: "1px solid black",
            marginBottom: "10px"
          }}
        ></div>
        <div className="color-details">
          <div>RGB: <strong>{pixelRGB}</strong></div>
          <div>HEX: <strong>{pixelHex}</strong></div>
        </div>
      </div>
    )}

    </>
  );
}

export default App;
