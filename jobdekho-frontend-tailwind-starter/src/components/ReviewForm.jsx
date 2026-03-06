import React, { useEffect, useState } from "react";

const initialState = {
  company: "",
  headline: "",
  role: "",
  rating: 5,
  subRatings: {
    workCulture: 5,
    salaryBenefits: 5,
    workLifeBalance: 5,
    management: 5,
    careerGrowth: 5,
  },
  pros: "",
  cons: "",
  advice: "",
  employmentStatus: "Current",
  recommends: "true",
  ceoApproval: "Approve",
  isAnonymous: true,
  location: "",
  industry: "",
  logo: "",
};

const RatingSelect = ({ name, value, onChange, label }) => (
  <label className="text-sm text-gray-700">
    {label}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
    >
      <option value="5">5</option>
      <option value="4">4</option>
      <option value="3">3</option>
      <option value="2">2</option>
      <option value="1">1</option>
    </select>
  </label>
);

const ReviewForm = ({ defaultCompany, onSubmit, submitting }) => {
  const [form, setForm] = useState({ ...initialState, company: defaultCompany || "" });

  useEffect(() => {
    if (defaultCompany) {
      setForm((prev) => ({ ...prev, company: defaultCompany }));
    }
  }, [defaultCompany]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubRatingChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      subRatings: {
        ...prev.subRatings,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      rating: Number(form.rating),
      subRatings: Object.fromEntries(
        Object.entries(form.subRatings).map(([k, v]) => [k, Number(v)])
      ),
      recommends: form.recommends === "" ? null : form.recommends === "true",
    };

    await onSubmit(payload);
    setForm((prev) => ({
      ...initialState,
      company: prev.company,
      location: prev.location,
      industry: prev.industry,
      logo: prev.logo,
    }));
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Add Review</h3>
      <form className="mt-4 grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
        <input
          required
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          required
          name="headline"
          value={form.headline}
          onChange={handleChange}
          placeholder="Review headline"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          required
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Job Role"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="text-sm text-gray-700">
            Overall Rating
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Employment Status
            <select
              name="employmentStatus"
              value={form.employmentStatus}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="Current">Current</option>
              <option value="Former">Former</option>
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Recommend to friend
            <select
              name="recommends"
              value={form.recommends}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
              <option value="">Not sure</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <RatingSelect
            name="workCulture"
            value={form.subRatings.workCulture}
            onChange={handleSubRatingChange}
            label="Work Culture"
          />
          <RatingSelect
            name="salaryBenefits"
            value={form.subRatings.salaryBenefits}
            onChange={handleSubRatingChange}
            label="Salary & Benefits"
          />
          <RatingSelect
            name="workLifeBalance"
            value={form.subRatings.workLifeBalance}
            onChange={handleSubRatingChange}
            label="Work Life Balance"
          />
          <RatingSelect
            name="management"
            value={form.subRatings.management}
            onChange={handleSubRatingChange}
            label="Management"
          />
          <RatingSelect
            name="careerGrowth"
            value={form.subRatings.careerGrowth}
            onChange={handleSubRatingChange}
            label="Career Growth"
          />
        </div>

        <textarea
          required
          name="pros"
          value={form.pros}
          onChange={handleChange}
          placeholder="Pros"
          className="min-h-20 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <textarea
          required
          name="cons"
          value={form.cons}
          onChange={handleChange}
          placeholder="Cons"
          className="min-h-20 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <textarea
          required
          name="advice"
          value={form.advice}
          onChange={handleChange}
          placeholder="Advice to management"
          className="min-h-20 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="text-sm text-gray-700">
            CEO Approval
            <select
              name="ceoApproval"
              value={form.ceoApproval}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="Approve">Approve</option>
              <option value="Neutral">Neutral</option>
              <option value="Disapprove">Disapprove</option>
              <option value="">No opinion</option>
            </select>
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Company Location"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="Industry"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <input
          name="logo"
          value={form.logo}
          onChange={handleChange}
          placeholder="Company Logo URL"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={form.isAnonymous}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Post as anonymous
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
};

export default ReviewForm;
