import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../api/requests";

export default function AddListingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create a listing.");
        return;
      }

      await createListing({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
      });

      setSuccess("Listing created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      console.error(err);
      setError("Failed to create listing.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Add New Listing
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

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
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            >
              <option value="">Select category</option>
              <option value="1">Electronics</option>
              <option value="2">Furniture</option>
              <option value="3">Vehicles</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}
