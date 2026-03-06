import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="jd-card relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-100 blur-2xl" />
      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-100 blur-2xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="jd-chip mb-5">Career Platform</p>
        <h1 className="jd-title text-4xl sm:text-5xl">
          Find Better Jobs Faster with <span className="text-brand-600">JobDekho</span>
        </h1>
        <p className="jd-subtitle mx-auto mt-4 max-w-2xl">
          Discover verified opportunities, apply smoothly, track every step, and manage your career in one place.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/jobs" className="jd-btn">
            Browse Jobs
          </Link>
          <Link to="/signup" className="jd-btn-secondary">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
