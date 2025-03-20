import React, { useState, useEffect } from "react";
import Label from "./Label";
import ProductSubmitForm from "./ProductSubmitForm";
import ProductList from "./ProductList";
import { ComponentType, Product } from "../types";

interface DynamicRendererProps {
  components: ComponentType[];
  onAddProduct: (newProduct: Product) => void;
}

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      onSearch(value);
    }, 300);
  };

  return (
    <div className="flex justify-center items-center mb-6 sm:mb-8 px-4 sm:px-6">
      <div
        className={`relative flex items-center ${
          isSearchActive ? "w-full max-w-md" : "mx-auto"
        }`}
      >
        {isSearchActive ? (
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <svg
              className="absolute left-2.5 top-2 h-4 w-4 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {isSearching && (
              <div className="absolute right-10 top-2.5">
                <div className="spinner-border h-3 w-3 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
              </div>
            )}
          </div>
        ) : null}
        <button
          onClick={() => setIsSearchActive(!isSearchActive)}
          className={`${
            isSearchActive ? "ml-2" : "mx-auto"
          } px-3 sm:px-4 py-1.5 sm:py-2 text-sm ${
            isSearchActive
              ? "bg-red-100 hover:bg-red-200 text-red-600"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          } font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-opacity-50 transition-colors shadow-sm flex items-center`}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isSearchActive ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            )}
          </svg>
          {isSearchActive ? "Close" : "Search"}
        </button>
      </div>
    </div>
  );
};

const DynamicRenderer: React.FC<DynamicRendererProps> = ({
  components,
  onAddProduct,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const orderedComponents = [...components].sort((a, b) => {
    if (a.type === "Label") return -1;
    if (b.type === "Label") return 1;
    return 0;
  });

  const renderComponent = (component: ComponentType, index: number) => {
    const { type, customAttributes } = component;

    switch (type) {
      case "Label":
        return <Label key={index} customAttributes={customAttributes} />;
      case "ProductSubmitForm":
        return (
          <ProductSubmitForm key={index} customAttributes={customAttributes} />
        );
      case "Button":
        return null;
      case "ProductList":
        const productList = customAttributes.productlist;
        if (searchQuery.trim() !== "") {
          const filteredItems = productList.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <ProductList
              key={index}
              customAttributes={{
                ...customAttributes,
                productlist: {
                  ...productList,
                  items: filteredItems,
                },
              }}
            />
          );
        }
        return <ProductList key={index} customAttributes={customAttributes} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-3"></div>
          <p className="text-gray-600">Loading product management...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto py-4 sm:py-6 md:py-8 animate-fadeIn"
      style={{
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      {components.find((comp) => comp.type === "Label") &&
        renderComponent(components.find((comp) => comp.type === "Label")!, -1)}

      <SearchBar onSearch={setSearchQuery} />

      {orderedComponents.map((component, index) => {
        if (component.type === "Label" || component.type === "Button") {
          return null;
        }
        return renderComponent(component, index);
      })}

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `,
        }}
      />
    </div>
  );
};

export default DynamicRenderer;
