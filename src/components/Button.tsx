import React, { useContext } from "react";
import { ButtonData, Product } from "../types";
import { FormContext } from "../context/FormContext";

interface ButtonProps {
  customAttributes: ButtonData["customAttributes"];
  onAddProduct: (newProduct: Product) => void;
}

const Button: React.FC<ButtonProps> = ({ customAttributes, onAddProduct }) => {
  const { text } = customAttributes.button;
  const { type = "button", className = "" } = customAttributes;
  const { formData, validateForm, resetForm } = useContext(FormContext);

  const handleClick = () => {
    if (type === "submit") {
      return; // For submit buttons, form will handle submission
    }

    const isValid = validateForm();

    if (isValid) {
      const newProduct: Product = {
        name: (formData.productName as string) || "New Product",
        price: Number(formData.price) || 0,
        imageSrc:
          (formData.imageUrl as string) || "https://via.placeholder.com/500",
      };

      onAddProduct(newProduct);
      resetForm();
      alert("Product created successfully!");
    } else {
      alert("Please fix the form errors before submitting.");
    }
  };

  const buttonClasses = `px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-sm ${className}`;

  return (
    <button
      type={type}
      onClick={type !== "submit" ? handleClick : undefined}
      className={buttonClasses}
    >
      {text}
    </button>
  );
};

export default Button;
