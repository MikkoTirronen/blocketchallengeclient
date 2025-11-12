import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../api/requests";
import AdForm from "~/components/AdForm";

export default function AddListingPage() {
  const navigate = useNavigate()
  const handleSuccess = ()=> navigate("/")

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Add New Listing
        </h1>
        <AdForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
