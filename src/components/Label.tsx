import React from "react";
import { LabelData } from "../types";

interface LabelProps {
  customAttributes: LabelData["customAttributes"];
}

const Label: React.FC<LabelProps> = ({ customAttributes }) => {
  const { text } = customAttributes.label;

  return (
    <h1 className="text-xl sm:text-2xl font-bold text-center my-4 sm:my-6 px-4">
      {text}
    </h1>
  );
};

export default Label;
