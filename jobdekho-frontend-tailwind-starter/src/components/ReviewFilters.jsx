import React from "react";

const ReviewFilters = ({ filters, onChange, onReset }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-6">
        <input
          name="role"
          value={filters.role}
          onChange={onChange}
          placeholder="Role"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          name="rating"
          value={filters.rating}
          onChange={onChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Rating</option>
          <option value="4">4+ </option>
          <option value="3">3+ </option>
          <option value="2">2+ </option>
          <option value="1">1+ </option>
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={onChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
        <input
          name="location"
          value={filters.location}
          onChange={onChange}
          placeholder="Location"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          name="employmentStatus"
          value={filters.employmentStatus}
          onChange={onChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Employment Status</option>
          <option value="Current">Current</option>
          <option value="Former">Former</option>
        </select>
        <select
          name="recommends"
          value={filters.recommends}
          onChange={onChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Recommend</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </section>
  );
};

export default ReviewFilters;
