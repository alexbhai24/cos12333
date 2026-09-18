import React, { useState, useEffect } from 'react';

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const TransparentImage: React.FC<TransparentImageProps> = ({ src, ...props }) => {
  const [processedSrc, setProcessedSrc] = useState<string>('');

  useEffect(() => {
    if (!src) return;

    // Direct return if it's already a transparent format that doesn't need processing,
    // or if it's a data URL.
    if (src.startsWith('data:')) {
      setProcessedSrc(src);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Check if pixel is white or near white (r, g, b all above 240)
            if (r > 238 && g > 238 && b > 238) {
              data[i + 3] = 0; // Set Alpha (transparency) to 0
            }
          }
          ctx.putImageData(imgData, 0, 0);
          setProcessedSrc(canvas.toDataURL());
        }
      } catch (e) {
        console.error('Error removing white background:', e);
        setProcessedSrc(src); // fallback to original on canvas security/CORS block
      }
    };
    img.onerror = () => {
      setProcessedSrc(src);
    };
  }, [src]);

  return <img src={processedSrc || src} {...props} />;
};
