import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE from "../../config";

function Preview() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE}/properties?limit=100`);
        setProperties(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F7FA]">
        <div className="w-10 h-10 border-4 border-[#122B49] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F7FA]">
        <div className="bg-white rounded-[12px] border border-red-200 p-8 text-center max-w-sm">
          <p className="font-Inter text-[15px] text-red-600 font-medium">Could not load listings</p>
          <p className="font-Inter text-[13px] text-[#7A7A7A] mt-1">{error}</p>
          <Link to="/" className="inline-block mt-4 bg-[#122B49] text-white font-Inter text-[13px] px-5 py-2 rounded-[6px]">
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F7FA]">
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-12 text-center max-w-sm">
          <p className="font-MerriweatherSans text-[20px] text-[#122B49]">No published listings yet</p>
          <Link to="/more-detail" className="inline-block mt-6 bg-[#122B49] text-white font-Inter text-[14px] px-6 py-3 rounded-[8px]">
            List your property
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-MerriweatherSans text-[26px] text-[#122B49]">Published Listings</h1>
          <Link to="/" className="font-Inter text-[14px] text-[#122B49] underline">Browse all</Link>
        </div>
        <div className="flex flex-col gap-4">
          {properties.map((p) => {
            const loc = p.location ?? {};
            const pricing = p.pricing ?? {};
            const title = [p.bhk_type, p.property_subtype || p.property_type || "Property"].filter(Boolean).join(" ");
            const locationText = [loc.building, loc.locality, loc.city].filter(Boolean).join(", ") || "Location not specified";
            const isRent = (p.property_for || "").toLowerCase() === "rent";
            return (
              <div key={p.id} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-MerriweatherSans text-[18px] text-[#122B49]">{title}</h2>
                    {p.property_for && (
                      <span className={`text-[10px] font-Inter font-semibold uppercase px-2 py-0.5 rounded-full ${isRent ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {p.property_for}
                      </span>
                    )}
                  </div>
                  <p className="font-Inter text-[13px] text-[#7A7A7A] mt-1 truncate">{locationText}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  {pricing.rent != null ? (
                    <p className="font-MerriweatherSans text-[20px] text-[#122B49]">
                      Rs. {Number(pricing.rent).toLocaleString("en-IN")}
                      {isRent && <span className="font-Inter text-[12px] text-[#7A7A7A] ml-1">/mo</span>}
                    </p>
                  ) : (
                    <p className="font-Inter text-[14px] text-[#7A7A7A]">Price on request</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Preview;
