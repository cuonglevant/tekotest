import React, { useState } from "react";
import { ProductCardProps } from "../types";

const ProductCard: React.FC<ProductCardProps> = ({
  productCardItem,
}: ProductCardProps) => {
  const { imageSrc, name, price } = productCardItem;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-102"
      style={{ height: "100%" }}
    >
      <div className="relative overflow-hidden h-48">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500">Image could not be loaded</p>
          </div>
        )}

        <img
          src={imageSrc}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md transform rotate-3">
          {formatPrice(price)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
          {name}
        </h3>
        <div className="flex justify-between items-center mt-4">
          <button className="text-sm px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Details
          </button>
          <button className="text-sm px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
