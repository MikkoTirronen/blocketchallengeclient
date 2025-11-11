import React, { useState, useEffect } from "react";
import { createListing, getCategories, updateListing } from "~/api/requests";
import axios from "axios";
import { useUser } from "~/contexts/userContext";

export interface Category {
  id: number;
  name: string;
}

interface AdFormProps {
  id?: number;
  initialData?: {
    title: string;
    description: string;
    price: number;
    categoryName: string;
    categoryId?: number;
    imageUrl?: string;
  };
  onSuccess: () => void;
}

export default function AdForm({ id, initialData, onSuccess }: AdFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  // Fetch categories from backend
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    categoryId: 0,
    imageUrl: "",
  });
  const { user } = useUser();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  console.log(formData);
  // Set initial data for edit
  useEffect(() => {
    if (initialData && categories.length > 0) {
      const catId =
        categories.find(
          (category) => category.name === initialData?.categoryName
        )?.id ?? 0;
      console.log({ "GET THIS SHIT": catId });
      setFormData({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        price: initialData.price ?? 0,
        categoryId: catId ?? 0,
        imageUrl: initialData.imageUrl ?? "",
      });
    }
  }, [initialData, categories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(user);
    try {
      if (id) {
        await updateListing(id, formData);
      } else {
        await createListing(formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Price (SEK)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Category</label>
        <select
          name="categoryId"
          value={formData.categoryId || ""}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
      >
        {id ? "Update Listing" : "Create Listing"}
      </button>
    </form>
  );
}
