import { useState } from "react";

const ProductImage = ({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: string;
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <img 
      src={hasError ? fallback : src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
};
export default ProductImage;
