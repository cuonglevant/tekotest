import { ApiResponse, ComponentType } from "../types";

const API_URL =
  process.env.API_URL ??
  "https://hiring-test.stag.tekoapis.net/api/products/management";

export const fetchProductsData = async (): Promise<ComponentType[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};
