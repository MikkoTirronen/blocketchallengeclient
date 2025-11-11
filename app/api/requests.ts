// src/utils/apiRequests.ts
import { api } from "./axiosClient";
import type { Category } from "~/components/AdForm";

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  sellerName: string;
  createdAt: string;
  imageUrl?: string;
}

export const getListings = async (): Promise<Listing[]> => {
  const res = await api.get<Listing[]>("/ads");
  return res.data;
};

export const getUserListings = async (username:string): Promise<Listing[]> => {
  const res = await api.get(`users/${username}`);
  return res.data;
};

export const deleteListing = async (id: number) => {
  await api.delete(`/ads/${id}`);
};

export const createListing = async (listing: {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
}) => {
  const res = await api.post("/ads", listing);
  return res.data;
};

export const updateListing = async (
  id: number,
  listing: {
    title: string;
    description: string;
    price: number;
    categoryId: number;
    imageUrl: string;
  }
) => {
  const res = await api.put(`/ads/${id}`, listing);
  return res.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/ads/categories");
  return res.data;
};

export const searchListings = async (search?: string, sort?: string, order?: string) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  const res = await api.get(`/ads?${params.toString()}`);
  return res.data;
};
