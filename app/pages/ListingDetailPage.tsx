import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdForm from "../components/AdForm";
import { useUser } from "~/contexts/userContext";
interface ListingDto {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  imageUrl?: string;
  createdAt: string;
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const fetchListing = async () => {
    try {
      const response = await axios.get<ListingDto>(
        `http://localhost:5033/api/ads/${id}`
      );
      setListing(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // Fetch listing details
  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      await axios.delete(`http://localhost:5033/api/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/my-listings");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the listing.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!listing) return <p className="text-center mt-10">Listing not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-blue-500 underline mb-4 inline-block">
        &larr; Back to listings
      </Link>

      {/* Listing Card */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        {listing.imageUrl && (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-80 object-cover rounded mb-4"
          />
        )}

        <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
        <p className="text-gray-700 mb-4">{listing.description}</p>
        <p className="text-green-600 text-2xl font-semibold mb-2">
          {listing.price.toFixed(2)} SEK
        </p>
        <p className="text-gray-500 mb-1">Seller: {listing.sellerName}</p>
        <p className="text-gray-500 mb-1">Category: {listing.categoryName}</p>
        <p className="text-gray-400 text-sm mb-4">
          Created: {new Date(listing.createdAt).toLocaleDateString()}
        </p>

        {/* Action buttons */}
        {user.username === listing.sellerName&&<div className="flex gap-4">
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            {showEditForm ? "Cancel Edit" : "Update"}
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>}
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Update Listing</h1>
          <AdForm
            id={listing.id}
            initialData={{
              title: listing.title,
              description: listing.description,
              price: listing.price,
              categoryName: listing.categoryName,
              imageUrl: listing.imageUrl,
            }}
            onSuccess={() => {
              setShowEditForm(false);
              fetchListing(); // refresh details
            }}
          />
        </div>
      )}
    </div>
  );
}
