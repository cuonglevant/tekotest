import React, { useState, useEffect } from "react";
import { ProductListData } from "../types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  customAttributes: ProductListData["customAttributes"];
}

const ProductList: React.FC<ProductListProps> = ({ customAttributes }) => {
  const { items } = customAttributes.productlist;
  const [visibleItems, setVisibleItems] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(items.length > 12);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsIntersecting(true);
        } else {
          setIsIntersecting(false);
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreTrigger = document.querySelector(".load-more-trigger");
    if (loadMoreTrigger) {
      loadMoreObserver.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        loadMoreObserver.unobserve(loadMoreTrigger);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    if (isIntersecting && hasMore) {
      setTimeout(() => {
        const nextItems = Math.min(items.length, visibleItems + 8);
        setVisibleItems(nextItems);
        setHasMore(nextItems < items.length);
      }, 300);
    }
  }, [isIntersecting, hasMore, items.length, visibleItems]);

  const visibleProducts = items.slice(0, visibleItems);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .smooth-scroll {
            scroll-behavior: smooth;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .product-item {
            animation-name: fadeIn;
            animation-duration: 0.5s;
            animation-fill-mode: both;
            animation-timing-function: ease-out;
          }
          `,
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-8 px-4 sm:px-6 overflow-auto pb-6 smooth-scroll">
        {visibleProducts.map((product, index) => (
          <div
            key={index}
            className="product-item"
            style={{
              animationDelay: `${(index % 8) * 0.1}s`,
            }}
          >
            <ProductCard productCardItem={product} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more-trigger flex justify-center py-4">
          <div className="animate-pulse flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
