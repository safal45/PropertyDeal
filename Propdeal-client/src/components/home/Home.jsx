import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../config";

// Maps property type to a simple SVG icon rendered inline
function PropertyIcon({ type }) {
  const t = (type || "").toLowerCase();
  if (t === "commercial") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="20" rx="2" stroke="white" strokeWidth="1.8" fill="none"/>
        <rect x="9" y="14" width="4" height="4" rx="0.5" stroke="white" strokeWidth="1.5" fill="none"/>
        <rect x="19" y="14" width="4" height="4" rx="0.5" stroke="white" strokeWidth="1.5" fill="none"/>
        <rect x="12" y="22" width="8" height="6" rx="0.5" stroke="white" strokeWidth="1.5" fill="none"/>
        <line x1="4" y1="8" x2="16" y2="2" stroke="white" strokeWidth="1.8"/>
        <line x1="28" y1="8" x2="16" y2="2" stroke="white" strokeWidth="1.8"/>
      </svg>
    );
  }
  if (t === "land/plot") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="20" width="24" height="8" rx="1" stroke="white" strokeWidth="1.8" fill="none"/>
        <path d="M8 20 L8 12 L16 6 L24 12 L24 20" stroke="white" strokeWidth="1.8" fill="none"/>
        <rect x="13" y="14" width="6" height="6" rx="0.5" stroke="white" strokeWidth="1.5" fill="none"/>
      </svg>
    );
  }
  // default residential
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16 L16 5 L28 16" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
      <rect x="6" y="16" width="20" height="12" rx="1" stroke="white" strokeWidth="1.8" fill="none"/>
      <rect x="13" y="20" width="6" height="8" rx="0.5" stroke="white" strokeWidth="1.5" fill="none"/>
      <rect x="9" y="19" width="4" height="4" rx="0.5" stroke="white" strokeWidth="1.5" fill="none"/>
      <rect x="19" y="19" width="4" height="4" rx="0.5" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

// Returns a deterministic gradient class based on property id or type
function cardGradient(property) {
  const seeds = [
    "from-[#1a3a5c] to-[#2d6a9f]",
    "from-[#1a4a3a] to-[#2d7a5f]",
    "from-[#3a1a4a] to-[#6a3a7f]",
    "from-[#4a2a1a] to-[#8a5a3a]",
    "from-[#1a3a4a] to-[#2d6a8a]",
  ];
  const key = (property.id || property.property_type || "").charCodeAt(0) % seeds.length;
  return seeds[key] || seeds[0];
}

function PropertyCard({ property, onEnquire }) {
  // R-001 fix: use ?? {} instead of = {} — null does not trigger destructuring defaults
  const location = property.location ?? {};
  const pricing = property.pricing ?? {};
  const { property_for, property_type, property_subtype, bhk_type, property_age } = property;
  const { city, locality, building } = location;
  const rent = pricing.rent;

  const isRent = (property_for || "").toLowerCase() === "rent";
  const locationText = [building, locality, city].filter(Boolean).join(", ") || "Location not specified";
  const title = [bhk_type, property_subtype || property_type || "Property"].filter(Boolean).join(" ");

  return (
    <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Visual header — gradient thumbnail with icon and badge */}
      <div className={`relative h-[120px] bg-gradient-to-br ${cardGradient(property)} flex items-center justify-center flex-shrink-0`}>
        <div className="opacity-60">
          <PropertyIcon type={property_type} />
        </div>
        {property_for && (
          <span
            className={`absolute top-3 right-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-Inter font-semibold uppercase tracking-widest ${
              isRent
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {property_for}
          </span>
        )}
        {property_type && (
          <span className="absolute bottom-3 left-3 inline-block px-2 py-0.5 bg-black/30 rounded text-[10px] font-Inter text-white/90 capitalize tracking-wide">
            {property_type}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Title */}
        <h2 className="font-MerriweatherSans font-normal text-[16px] text-[#122B49] leading-snug line-clamp-1">
          {title}
        </h2>

        {/* Location */}
        <div className="flex items-start gap-1.5">
          <svg className="flex-shrink-0 mt-0.5" width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#7A7A7A"/>
          </svg>
          <p className="font-Inter text-[12px] font-normal text-[#7A7A7A] line-clamp-1 leading-relaxed">
            {locationText}
          </p>
        </div>

        {/* Feature chips */}
        {(property_subtype || property_age) && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {property_subtype && (
              <span className="bg-[#F3F4F6] text-[#4B5563] font-Inter text-[10px] px-2 py-0.5 rounded capitalize">
                {property_subtype}
              </span>
            )}
            {property_age && (
              <span className="bg-[#F3F4F6] text-[#4B5563] font-Inter text-[10px] px-2 py-0.5 rounded">
                {property_age}
              </span>
            )}
          </div>
        )}

        {/* Divider + price + CTA */}
        <div className="border-t border-[#F3F4F6] mt-auto pt-3 flex items-center justify-between gap-2">
          <div>
            {rent != null ? (
              <p className="font-MerriweatherSans font-normal text-[18px] text-[#122B49] leading-none">
                Rs.{" "}
                <span className="font-semibold">{Number(rent).toLocaleString("en-IN")}</span>
                {/* R-010 fix: only show /mo for rent listings */}
                {isRent && (
                  <span className="font-Inter text-[11px] text-[#7A7A7A] font-normal ml-1">/mo</span>
                )}
              </p>
            ) : (
              <p className="font-Inter text-[13px] text-[#7A7A7A]">Price on request</p>
            )}
          </div>
          <button
            className="flex-shrink-0 bg-[#122B49] text-white font-Inter text-[11px] font-medium px-3 py-1.5 rounded-[6px] hover:bg-[#0a1e34] transition-colors duration-150 tracking-wide"
            onClick={() => onEnquire(property.id)}
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-[#122B49] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  // R-005 fix: retryKey forces useEffect to re-run even when page is already 1
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}/properties?page=${page}&limit=20`);
        setProperties(response.data.data || []);
        setPagination(response.data.pagination || null);
      } catch (err) {
        // R-004 fix: V2 errors use key "error"; fall back to "message" then Axios message
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Failed to load properties."
        );
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, retryKey]);

  const handlePrev = () => {
    if (pagination?.has_prev) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (pagination?.has_next) setPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero header */}
      <div className="bg-[#122B49] pt-20 pb-10 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="text-white">
            <h1 className="font-MerriweatherSans font-normal text-[28px] md:text-[36px] leading-tight">
              Find Your Next Property
            </h1>
            <p className="font-Inter font-light text-[15px] mt-2 text-[#CBD5E1]">
              Browse verified listings for rent and sale across India.
            </p>
          </div>
          <Link
            to="/more-detail"
            className="inline-block bg-white text-[#122B49] font-Inter font-medium text-[14px] px-6 py-3 rounded-[8px] hover:bg-[#F0F4F8] transition-colors duration-150 whitespace-nowrap self-start md:self-auto"
          >
            + List your property
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 py-10">
        {loading && <Spinner />}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-[12px] p-8 text-center">
            <p className="font-Inter text-[15px] text-red-600 font-medium">Something went wrong</p>
            <p className="font-Inter text-[13px] text-[#7A7A7A] mt-1">{error}</p>
            <button
              onClick={() => { setPage(1); setRetryKey((k) => k + 1); }}
              className="mt-4 bg-[#122B49] text-white font-Inter text-[13px] px-5 py-2 rounded-[6px] hover:bg-[#091524] transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-12 text-center">
            <p className="font-MerriweatherSans font-normal text-[20px] text-[#122B49]">No listings yet</p>
            <p className="font-Inter text-[14px] text-[#7A7A7A] mt-2">
              Be the first to list your property on PropertyDeal.
            </p>
            <Link
              to="/more-detail"
              className="inline-block mt-6 bg-[#122B49] text-white font-Inter font-medium text-[14px] px-6 py-3 rounded-[8px] hover:bg-[#091524] transition-colors"
            >
              List your property
            </Link>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <>
            {pagination && (
              <p className="font-Inter text-[13px] text-[#7A7A7A] mb-5">
                Showing{" "}
                <span className="font-medium text-[#122B49]">
                  {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#122B49]">{pagination.total}</span> listing
                {pagination.total !== 1 ? "s" : ""}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEnquire={(id) => navigate(`/property/${id}`)}
                />
              ))}
            </div>

            {/* Pagination controls */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={handlePrev}
                  disabled={!pagination.has_prev}
                  className={`font-Inter text-[14px] px-5 py-2 rounded-[6px] border transition-colors ${
                    pagination.has_prev
                      ? "border-[#122B49] text-[#122B49] hover:bg-[#122B49] hover:text-white"
                      : "border-[#E5E7EB] text-[#CBD5E1] cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>
                <span className="font-Inter text-[14px] text-[#7A7A7A]">
                  Page <span className="font-medium text-[#122B49]">{pagination.page}</span> of{" "}
                  <span className="font-medium text-[#122B49]">{pagination.pages}</span>
                </span>
                <button
                  onClick={handleNext}
                  disabled={!pagination.has_next}
                  className={`font-Inter text-[14px] px-5 py-2 rounded-[6px] border transition-colors ${
                    pagination.has_next
                      ? "border-[#122B49] text-[#122B49] hover:bg-[#122B49] hover:text-white"
                      : "border-[#E5E7EB] text-[#CBD5E1] cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
