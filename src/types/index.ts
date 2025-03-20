// Common interfaces
export interface ComponentData {
  type: string;
  customAttributes: any;
}

// Label component
export interface LabelData extends ComponentData {
  type: "Label";
  customAttributes: {
    label: {
      text: string;
    };
  };
}

// Form field interfaces
export interface FormField {
  label: string;
  required?: boolean;
  name: string;
  type: string;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

// Product Submit Form component
export interface ProductSubmitFormData extends ComponentData {
  type: "ProductSubmitForm";
  customAttributes: {
    form: FormField[];
  };
}

// Button component
export interface ButtonData extends ComponentData {
  type: "Button";
  customAttributes: {
    button: {
      text: string;
    };
    type?: "button" | "submit" | "reset";
    className?: string;
  };
}

// Product Card component
export interface ProductCardProps {
  productCardItem: Product;
}

// Product interface
export interface Product {
  name: string;
  price: number;
  imageSrc: string;
}

// Product List component
export interface ProductListData extends ComponentData {
  type: "ProductList";
  customAttributes: {
    productlist: {
      items: Product[];
    };
  };
}

// Union type for all component types
export type ComponentType =
  | LabelData
  | ProductSubmitFormData
  | ButtonData
  | ProductListData;

// API response interface
export interface ApiResponse {
  code: string;
  message: string;
  data: ComponentType[];
}
