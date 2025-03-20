import React, { useEffect, useState } from "react";
import DynamicRenderer from "./components/DynamicRenderer";
import { fetchProductsData } from "./services/api";
import { ComponentType, Product } from "./types";
import { FormProvider } from "./context/FormContext";
import "./App.css";

const App: React.FC = () => {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProductsData();
        setComponents(data);

        const productListComponent = data.find(
          (component) => component.type === "ProductList"
        );
        if (
          productListComponent &&
          "productlist" in productListComponent.customAttributes
        ) {
          setProducts(productListComponent.customAttributes.productlist.items);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);

    setComponents((prevComponents) => {
      return prevComponents.map((component) => {
        if (component.type === "ProductList") {
          return {
            ...component,
            customAttributes: {
              ...component.customAttributes,
              productlist: {
                ...component.customAttributes.productlist,
                items: [
                  newProduct,
                  ...component.customAttributes.productlist.items,
                ],
              },
            },
          };
        }
        return component;
      });
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-red-500 text-center">
          <p className="text-base sm:text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider>
      <div className="App bg-gray-50 min-h-screen">
        <DynamicRenderer
          components={components}
          onAddProduct={handleAddProduct}
        />
      </div>
    </FormProvider>
  );
};

export default App;
