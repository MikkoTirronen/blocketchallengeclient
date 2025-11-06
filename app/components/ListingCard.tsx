// src/components/ListingCard.tsx
import { Link } from "react-router-dom";
import type { Listing } from "../api/requests";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {listing.imageUrl ? (
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}
      <div className="p-4 flex flex-col justify-between h-40">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            {listing.title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>
          <p className="text-gray-600 text-sm line-clamp-2">
            {"seller: " + listing.sellerName}
          </p>
          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.createdAt}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-blue-600 font-bold text-lg">
            ${listing.price}
          </span>

          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm">
            <Link to={`/ads/${listing.id}`}>View</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
