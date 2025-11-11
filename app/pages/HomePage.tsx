import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import {
  deleteListing,
  getListings,
  getUserListings,
  searchListings,
  type Listing,
} from "../api/requests";
import { useUser } from "~/contexts/userContext";

export default function Home() {
  const { user, logout } = useUser();
  const [listings, setListings] = useState<Listing[]>([]);
  const [userListings, setUserListings] = useState<Listing[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState<"price" | "date" | undefined>();
  const [order, setOrder] = useState<"asc" | "desc" | undefined>();
  console.log(user)
  useEffect(() => {
    let cancelled = false;

    const loadListings = async () => {
      try {
        if (user) {
          const listings = await getUserListings(user.username); // no username needed
          if (!cancelled) setUserListings(listings);
        }
      } catch (err) {
        console.error("Failed to load user listings:", err);
      }
    };

    loadListings();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Debounced fetch
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await searchListings(searchTerm || undefined, sort, order);
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sort, order]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchListings();
    }, 400);
    return () => clearTimeout(timeout);
  }, [fetchListings]);


  const handleDelete = async (id: number) => {
    await deleteListing(id);
    setUserListings(userListings.filter((l) => l.id !== id));
  };

  // displayed listings = always "listings"
  const displayedListings = listings;

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
                onClick={logout} // call context logout
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
            {userListings.length ? (
              userListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-600">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{listing.description}</p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/ads/${listing.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-yellow-600"
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

      {/* 🔍 Search + Sort Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          All Listings
        </h2>

        <div className="max-w-md mb-4">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setSort("price");
              setOrder(order === "asc" ? "desc" : "asc");
            }}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            Sort by Price ({order === "asc" && sort === "price" ? "↑" : "↓"})
          </button>

          <button
            onClick={() => {
              setSort("date");
              setOrder(order === "asc" ? "desc" : "asc");
            }}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            Sort by Date ({order === "asc" && sort === "date" ? "↑" : "↓"})
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!loading && displayedListings.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            {searchTerm ? "No results found." : "No listings available."}
          </p>
        )}
      </section>
    </div>
  );
}
