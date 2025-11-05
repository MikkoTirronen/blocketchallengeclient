import { useEffect, useState } from "react";
import { getListings, type Listing } from "~/api/Listings";
import ListingCard from "~/components/ListingCard";

export function Welcome() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return;
  <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <main className="flex">
      <div className="p-6 bg-gray-50 min-h-screen">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 drop-shadow-lg">
            Blocket Challenge
          </h1>
          <p className="text-gray-600 mt-2">Explore the latest listings</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </main>
  );
}
