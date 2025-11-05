import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface ListingDto {
  id: number;
  title: string;
  description?: string;
  price: number;
  sellerName: string;
  sellerId?: number;
  categoryName: string;
  createdAt: string;
  imageUrl?: string;
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!listing) return <p className="text-center mt-10">Listing not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-blue-500 underline mb-4 inline-block">
        &larr; Back to listings
      </Link>

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
          ${listing.price.toFixed(2)}
        </p>
        <p className="text-gray-500 mb-1">Seller: {listing.sellerName}</p>
        <p className="text-gray-500 mb-1">Category: {listing.categoryName}</p>
        <p className="text-gray-400 text-sm">
          Created: {new Date(listing.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
