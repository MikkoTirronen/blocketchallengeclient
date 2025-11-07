import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../api/requests";
import AdForm from "~/components/AdForm";

export default function AddListingPage() {
  // const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   title: "",
  //   description: "",
  //   price: "",
  //   categoryId: "",
  //   imageUrl: "",
  // });
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setError("You must be logged in to create a listing.");
  //       return;
  //     }

  //     await createListing({
  //       title: formData.title,
  //       description: formData.description,
  //       price: parseFloat(formData.price),
  //       categoryId: parseInt(formData.categoryId),
  //       imageUrl: formData.imageUrl,
  //     });

  //     setSuccess("Listing created successfully!");
  //     setTimeout(() => navigate("/"), 1500);
  //   } catch (err: any) {
  //     console.error(err);
  //     setError("Failed to create listing.");
  //   }
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Add New Listing
        </h1>
{/* 
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>} */}

        <AdForm onSuccess={() => {}} />
      </div>
    </div>
  );
}
