import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Assuming Spinner is a simple loading spinner component
import {
  MessageSquare, // Icon for overall reviews page or review content
  Star, // For ratings, if applicable (we'll keep it general for now)
  Calendar, // For date
  Speech, // For no reviews state
} from "lucide-react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]); // always an array
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
        toast.success("Reviews loaded successfully!"); // Added success toast
      } catch (err) {
        console.error("Failed to load reviews:", err); // More detailed error logging
        toast.error("Failed to load reviews. Please try again.");
        setReviews([]); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight drop-shadow-sm">
          <MessageSquare className="inline-block w-10 h-10 mr-3 text-indigo-600" /> What People Say About Us
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            {/* Simple Tailwind CSS spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <Speech className="w-16 h-16 text-indigo-400 mb-6 animate-bounce-slow" />
            <p className="text-xl font-medium text-gray-700 mb-2">No reviews published yet!</p>
            <p className="text-md text-gray-500 text-center">
              Be the first to share your experience with JobDekho.
            </p>
            {/* You can add a button here to navigate to a "Post Review" page if one exists */}
            {/* <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold">
              Write a Review
            </button> */}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <li
                key={review._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col transform hover:-translate-y-1"
              >
                {/* Optional: If you have a rating field, you can display stars */}
                {/* <div className="flex items-center text-yellow-500 mb-3">
                    {[...Array(review.rating || 0)].map((_, i) => <Star key={i} size={20} fill="currentColor" stroke="none" />)}
                    {review.rating ? <span className="ml-2 text-gray-700 text-sm">({review.rating}/5)</span> : null}
                </div> */}

                <p className="text-gray-800 leading-relaxed text-base mb-4 flex-grow">
                  <span className="font-semibold mr-2">"</span>{review.content}<span className="font-semibold ml-2">"</span>
                </p>
                <p className="text-sm text-gray-500 mt-auto flex items-center justify-end">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  Posted on {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reviews;