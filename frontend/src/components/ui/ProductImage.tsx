"use client";

import React, { useState } from 'react';

const FALLBACK_IMAGE = 'https://placehold.co/300?text=Sin+imagen';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <img
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
};

export default ProductImage;
