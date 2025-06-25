// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Welcome to JobDekho 👋
      </h1>
      <p className="text-lg text-gray-600 mb-6 max-w-xl">
        Discover your next opportunity. Find jobs, apply with ease, and manage your career from a single platform.
      </p>

      <div className="space-x-4">
        <Link
          to="/jobs"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Browse Jobs
        </Link>
        <Link
          to="/login"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default Home;
