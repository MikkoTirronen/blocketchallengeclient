import axios, { AxiosError } from "axios";
import type { Category } from "~/components/AdForm";

// 1️⃣ Define a type for your listing data
export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  sellerName: string;
  createdAt: string;
  imageUrl?: string;
}

// 2️⃣ Create a reusable Axios instance
const api = axios.create({
  baseURL: "http://localhost:5033/api",
});

// 3️⃣ Typed GET request
export const getListings = async (): Promise<Listing[]> => {
  try {
    const response = await api.get<Listing[]>("/ads");
    console.table(response.data)
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Error fetching listings:", error.message);
    throw error; // rethrow so callers can handle it
  }
};

export const getUserListings = async (username: string) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/ads/my-ads`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteListing = async (id: number) => {
  const token = localStorage.getItem("token");
  await api.delete(`/ads/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createListing = async (listing: {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/ads", listing, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateListing = async (id: number,listing: {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/ads/${id}`, listing, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getCategories = async ():Promise<Category[]>=>{
  const res = await api.get("/ads/categories")
  return res.data;
}

export async function searchListings(search?: string, sort?: string, order?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  const response = await api.get(`/ads?${params.toString()}`);
  if (!response) throw new Error("Failed to fetch listings");
  return response.data;
}