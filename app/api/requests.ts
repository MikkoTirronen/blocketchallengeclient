import axios, { AxiosError } from "axios";

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
}) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/ads", listing, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};