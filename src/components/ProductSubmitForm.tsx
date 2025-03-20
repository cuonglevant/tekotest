import React, { useState, useContext } from "react";
import Button from "./Button";
import { FormContext } from "../context/FormContext";

const ProductSubmitForm: React.FC<{ customAttributes: any }> = ({
  customAttributes,
}) => {
  const { formState, updateField, validateForm, resetForm, handleSubmit } =
    useContext(FormContext);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  const [fileHover, setFileHover] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({
    message: "",
    type: null,
  });

  const handleInputBlur = (field: string) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fileField = e.target.name;

    updateField(fileField, file || null);
    setFieldTouched((prev) => ({ ...prev, [fileField]: true }));

    if (file) {
      const fiveMB = 5 * 1024 * 1024;
      if (file.size > fiveMB) {
        updateField("errors", {
          ...formState.errors,
          [fileField]: "File size exceeds 5MB limit",
        });
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        updateField("errors", {
          ...formState.errors,
          [fileField]: "Invalid file type. Please use JPEG, PNG, GIF or WebP",
        });
        return;
      }

      const newErrors = { ...formState.errors };
      delete newErrors[fileField];
      updateField("errors", newErrors);
    }
  };

  const getFieldValidationClass = (fieldName: string) => {
    if (!fieldTouched[fieldName] && !submitAttempted) return "";

    const hasError = formState.errors[fieldName];
    if (hasError) {
      return "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50";
    } else if (fieldTouched[fieldName] || submitAttempted) {
      return "border-green-500 focus:ring-green-500 focus:border-green-500";
    }
    return "";
  };

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const allFields = ["name", "description", "price", "image"];
    const allTouched = allFields.reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );
    setFieldTouched(allTouched);

    const isValid = validateForm();

    if (isValid) {
      try {
        setFormFeedback({ message: "Submitting...", type: null });
        await handleSubmit(e);
        setFormFeedback({
          message: "Product successfully added!",
          type: "success",
        });
        resetForm();
        setFieldTouched({});
        setSubmitAttempted(false);

        setTimeout(() => {
          setFormFeedback({ message: "", type: null });
        }, 3000);
      } catch (error) {
        setFormFeedback({
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while submitting the form",
          type: "error",
        });
      }
    } else {
      setFormFeedback({
        message: "Please fix the errors in the form",
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out">
      <form onSubmit={handleLocalSubmit} className="space-y-5">
        <div className="transition-all duration-200 ease-in-out">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => handleInputBlur("name")}
            className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${getFieldValidationClass(
              "name"
            )}`}
            placeholder="Enter product name"
          />
          {(fieldTouched.name || submitAttempted) && formState.errors.name && (
            <p className="mt-1 text-sm text-red-600 transition-opacity duration-200 ease-in-out">
              {formState.errors.name}
            </p>
          )}
        </div>

        <div className="transition-all duration-200 ease-in-out">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={(e) => updateField("description", e.target.value)}
            onBlur={() => handleInputBlur("description")}
            className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${getFieldValidationClass(
              "description"
            )}`}
            rows={3}
            placeholder="Enter product description"
          ></textarea>
          {(fieldTouched.description || submitAttempted) &&
            formState.errors.description && (
              <p className="mt-1 text-sm text-red-600 transition-opacity duration-200 ease-in-out">
                {formState.errors.description}
              </p>
            )}
        </div>

        <div className="transition-all duration-200 ease-in-out">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formState.price}
            onChange={(e) => updateField("price", parseFloat(e.target.value))}
            onBlur={() => handleInputBlur("price")}
            className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${getFieldValidationClass(
              "price"
            )}`}
            placeholder="Enter product price"
            min="0"
            step="0.01"
          />
          {(fieldTouched.price || submitAttempted) &&
            formState.errors.price && (
              <p className="mt-1 text-sm text-red-600 transition-opacity duration-200 ease-in-out">
                {formState.errors.price}
              </p>
            )}
        </div>

        <div className="transition-all duration-200 ease-in-out">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Image <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative border-2 border-dashed rounded-md p-4 text-center transition-all duration-200 ease-in-out ${
              fileHover
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${getFieldValidationClass("image")}`}
            onDragOver={(e) => {
              e.preventDefault();
              setFileHover(true);
            }}
            onDragLeave={() => setFileHover(false)}
            onDrop={(e) => {
              e.preventDefault();
              setFileHover(false);
              const dt = e.dataTransfer;
              const files = dt.files;
              if (files.length) {
                const fileInput = document.getElementById(
                  "image"
                ) as HTMLInputElement;
                if (fileInput) {
                  fileInput.files = files;
                  const event = new Event("change", { bubbles: true });
                  fileInput.dispatchEvent(event);
                }
              }
            }}
          >
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              onBlur={() => handleInputBlur("image")}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="image"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4m4 4v-4m0 0h12a4 4 0 004-4v-4m-4 4h-8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-700">
                {formState.image
                  ? `Selected: ${formState.image.name}`
                  : "Drop file here or click to upload"}
              </span>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
              {formState.image && (
                <div className="mt-2 flex justify-center">
                  <div className="h-20 w-20 relative border rounded-md overflow-hidden">
                    <img
                      src={URL.createObjectURL(formState.image)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </label>
          </div>
          {(fieldTouched.image || submitAttempted) &&
            formState.errors.image && (
              <p className="mt-1 text-sm text-red-600 transition-opacity duration-200 ease-in-out">
                {formState.errors.image}
              </p>
            )}
        </div>

        <div className="flex flex-col items-stretch mt-6">
          <Button
            customAttributes={{
              type: "submit",
              button: {
                text: "Create Product",
              },
              className:
                "w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
            }}
            onAddProduct={() => {}}
          />

          {formFeedback.message && (
            <div
              className={`mt-3 p-2 text-center rounded-md ${
                formFeedback.type === "success"
                  ? "bg-green-100 text-green-800"
                  : formFeedback.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              } transition-all duration-300 ease-in-out`}
            >
              {formFeedback.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductSubmitForm;
