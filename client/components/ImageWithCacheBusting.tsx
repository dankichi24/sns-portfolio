import React from "react";

interface ImageWithCacheBustingProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  cacheBust?: boolean;
}

const ImageWithCacheBusting: React.FC<ImageWithCacheBustingProps> = ({
  src,
  alt = "",
  className = "",
  style,
  cacheBust = false,
  onClick,
}) => {
  const url = cacheBust ? `${src}?v=${Date.now()}` : src;

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
};

export default ImageWithCacheBusting;
