import React, { createContext, useState, ReactNode } from "react";
import { FormField } from "../types";

interface FormState {
  name: string;
  description: string;
  price: number | string;
  image: File | null;
  errors: Record<string, string>;
}

interface FormContextProps {
  formData: Record<string, string | number>;
  formErrors: Record<string, string>;
  setFormData: (data: Record<string, string | number>) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
  formState: FormState;
  updateField: (fieldName: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const defaultValue: FormContextProps = {
  formData: {},
  formErrors: {},
  setFormData: () => {},
  setFormErrors: () => {},
  validateForm: () => false,
  resetForm: () => {},
  formFields: [],
  setFormFields: () => {},
  formState: {
    name: "",
    description: "",
    price: "",
    image: null,
    errors: {},
  },
  updateField: () => {},
  handleSubmit: async () => {},
};

export const FormContext = createContext<FormContextProps>(defaultValue);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    price: "",
    image: null,
    errors: {},
  });

  const updateField = (fieldName: string, value: any) => {
    if (fieldName === "errors") {
      setFormState((prev) => ({
        ...prev,
        errors: value,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formState.name) {
      errors.name = "Product name is required";
    }

    if (!formState.description) {
      errors.description = "Description is required";
    }

    if (!formState.price) {
      errors.price = "Price is required";
    } else if (Number(formState.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!formState.image) {
      errors.image = "Product image is required";
    }

    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }

      if (field.type === "number" && formData[field.name]) {
        const value = Number(formData[field.name]);
        if (field.minValue && value < field.minValue) {
          errors[
            field.name
          ] = `${field.label} must be at least ${field.minValue}`;
        }
        if (field.maxValue && value > field.maxValue) {
          errors[
            field.name
          ] = `${field.label} must be at most ${field.maxValue}`;
        }
      }

      if (field.type === "text" && field.maxLength && formData[field.name]) {
        const value = String(formData[field.name]);
        if (value.length > field.maxLength) {
          errors[
            field.name
          ] = `${field.label} must be no more than ${field.maxLength} characters`;
        }
      }
    });

    updateField("errors", errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({});
    setFormErrors({});
    setFormState({
      name: "",
      description: "",
      price: "",
      image: null,
      errors: {},
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        resetForm();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Form validation failed"));
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        formErrors,
        setFormErrors,
        validateForm,
        resetForm,
        formFields,
        setFormFields,
        formState,
        updateField,
        handleSubmit,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
