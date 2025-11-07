import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import {
  deleteListing,
  getListings,
  getUserListings,
  type Listing,
} from "../api/requests";
import axios from "axios";
import debounce from "lodash.debounce";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [user, setUser] = useState<{ username: string; token: string } | null>(
    null
  );

  // Load logged-in user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      if (username && token) setUser({ username, token });
    }
  }, []);

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

    if (user) {
      getUserListings(user.username).then(setUserListings);
    }
  }, [user]);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
  };

  const handleDelete = async (id: number) => {
    await deleteListing(id);
    setUserListings(userListings.filter((l) => l.id !== id));
  };

  // 🔎 Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const res = await axios.get<Listing[]>(
          `http://localhost:5033/api/ads/search/${encodeURIComponent(term)}`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 500),
    []
  );

  // Trigger search when term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const displayedListings =
    searchTerm.trim() !== "" ? searchResults : listings;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 drop-shadow-lg">
          Blocket Challenge
        </h1>
        <p className="text-gray-600 mt-2">Explore the latest listings</p>

        <div className="mt-4">
          {user ? (
            <div className="text-gray-800">
              Logged in as <strong>{user.username}</strong>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </a>
          )}
        </div>
      </header>

      {user && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            My Listings
          </h2>
          <Link
            to="/create"
            className="ml-4 m-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Listing
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
            {userListings.length !== 0 ? (
              userListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-blue-600">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{listing.description}</p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/ads/${listing.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      View
                    </Link>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(listing.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-4 py-4">No listings found.</p>
            )}
          </div>
        </section>
      )}

      {/* 🔍 Search Input */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          All Listings
        </h2>

        <div className="max-w-md mb-6">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        {searchLoading && (
          <p className="text-gray-500 text-center mb-4">Searching...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {!loading && displayedListings.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            {searchTerm ? "No results found." : "No listings available."}
          </p>
        )}
      </section>
    </div>
  );
}
