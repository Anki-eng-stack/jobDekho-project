import React from "react";
import { ThumbsUp } from "lucide-react";

const renderStars = (value) => {
  const safe = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return "*".repeat(safe) + "-".repeat(5 - safe);
};

const subRows = [
  ["workCulture", "Work Culture"],
  ["salaryBenefits", "Salary & Benefits"],
  ["workLifeBalance", "Work Life Balance"],
  ["management", "Management"],
  ["careerGrowth", "Career Growth"],
];

const ReviewCard = ({ review, onHelpful }) => {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-gray-900">{review.headline || "Employee Review"}</p>
          <p className="text-xs text-gray-500">
            {review.isAnonymous ? "Anonymous" : review.user?.name || "User"} | {review.role || "Role not specified"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">{Number(review.rating || 0).toFixed(1)}</p>
          <p className="text-xs text-amber-500">{renderStars(review.rating)}</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        {!!review.employmentStatus && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">{review.employmentStatus}</span>
        )}
        {review.recommends !== null && (
          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
            Recommends: {review.recommends ? "Yes" : "No"}
          </span>
        )}
        {!!review.ceoApproval && (
          <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">CEO: {review.ceoApproval}</span>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-1 text-xs text-gray-600 md:grid-cols-2">
        {subRows.map(([key, label]) => (
          <p key={key}>
            {label}: {Number(review.subRatings?.[key] || 0).toFixed(1)}
          </p>
        ))}
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-gray-900">Pros:</p>
          <p>{review.pros || "-"}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Cons:</p>
          <p>{review.cons || "-"}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Advice to management:</p>
          <p>{review.advice || "-"}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Posted on{" "}
          {new Date(review.createdAt).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <button
          type="button"
          onClick={() => onHelpful(review._id)}
          className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs ${
            review.userHelpful
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ThumbsUp size={14} /> Helpful ({review.helpfulCount || 0})
        </button>
      </div>
    </article>
  );
};

export default ReviewCard;
