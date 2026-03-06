import React from "react";

const rows = [
  { key: "workCulture", label: "Work Culture" },
  { key: "salaryBenefits", label: "Salary & Benefits" },
  { key: "workLifeBalance", label: "Work Life Balance" },
  { key: "management", label: "Management" },
  { key: "careerGrowth", label: "Career Growth" },
];

const renderStars = (value) => {
  const safe = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return "*".repeat(safe) + "-".repeat(5 - safe);
};

const RatingSummary = ({ summary }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Overall Rating Summary</h3>
      <div className="mt-4 space-y-2">
        {rows.map((item) => (
          <div key={item.key} className="grid grid-cols-[180px_1fr_auto] items-center gap-3 text-sm">
            <p className="text-gray-700">{item.label}</p>
            <p className="text-amber-500">{renderStars(summary?.[item.key])}</p>
            <p className="text-gray-600">{Number(summary?.[item.key] || 0).toFixed(1)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RatingSummary;
