import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[85vh] text-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 animate-fade-in">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-5 leading-tight tracking-tight drop-shadow-lg">
        Welcome to <span className="text-indigo-600">JobDekho</span> 👋
      </h1>
      <p className="text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
        Your journey to the perfect career starts here. Explore thousands of opportunities, apply seamlessly, and take control of your professional future.
      </p>

      <div className="flex space-x-6">
        <Link
          to="/jobs"
          className="bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-lg font-semibold"
        >
          Browse Jobs
        </Link>
        <Link
          to="/login"
          className="border-2 border-indigo-600 text-indigo-700 px-8 py-3 rounded-full hover:bg-indigo-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-lg font-semibold"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default Home;