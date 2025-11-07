// src/components/ListingCard.tsx
import { Link } from "react-router-dom";
import type { Listing } from "../api/requests";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image Section */}
      {listing.imageUrl ? (
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
          No Image
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col grow p-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {listing.title}
          </h2>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-gray-500 text-xs">Seller: {listing.sellerName}</p>
          <p className="text-gray-400 text-xs">
            {new Date(listing.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-green-600 font-bold text-lg">
            ${listing.price.toFixed(2)}
          </span>
          <Link
            to={`/ads/${listing.id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
