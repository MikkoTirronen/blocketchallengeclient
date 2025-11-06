import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import { getListings, type Listing } from "../api/Listings";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch listings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-blue-600 drop-shadow-lg">
            Blocket Challenge
          </h1>
          <p className="text-gray-600 mt-2">Explore the latest listings</p>
        </div>

        <div className="absolute right-6 top-6">
          {username ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Hello, <span className="text-blue-600">{username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
