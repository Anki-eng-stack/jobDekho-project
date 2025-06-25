import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);      // always an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/reviews");
        // default to empty array if the payload isn't shaped as expected
        const list = Array.isArray(res.data.reviews)
          ? res.data.reviews
          : [];
        setReviews(list);
      } catch (err) {
        toast.error("Failed to load reviews");
        setReviews([]); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review._id} className="bg-white p-4 shadow rounded">
              <p>{review.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted on {new Date(review.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;
