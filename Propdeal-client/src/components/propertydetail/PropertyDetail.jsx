import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import API_BASE from "../../config";

// Fix default Leaflet marker icon broken by webpack (same pattern as About.jsx)
const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow });
L.Marker.prototype.options.icon = DefaultIcon;

// ------------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------------

function Badge({ label, variant = "neutral" }) {
  const styles = {
    rent: "bg-blue-100 text-blue-700",
    sale: "bg-emerald-100 text-emerald-700",
    neutral: "bg-[#F3F4F6] text-[#4B5563]",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-Inter font-semibold uppercase tracking-widest ${styles[variant] || styles.neutral}`}
    >
      {label}
    </span>
  );
}

function FeatureChip({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-[8px] border text-[13px] font-Inter transition-colors ${
        active === true
          ? "border-[#122B49] bg-[#EEF3F8] text-[#122B49]"
          : active === false
          ? "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] line-through"
          : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF]"
      }`}
    >
      <span className="text-[15px]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="font-MerriweatherSans font-normal text-[18px] text-[#122B49] mb-4 pb-2 border-b border-[#E5E7EB]">
      {children}
    </h2>
  );
}

function DetailRow({ label, value }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <span className="font-Inter text-[12px] text-[#7A7A7A] uppercase tracking-wider flex-shrink-0 w-36">
        {label}
      </span>
      <span className="font-Inter text-[14px] text-[#1F2937] capitalize">{value}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-32">
      <div className="w-10 h-10 border-4 border-[#122B49] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/properties/${id}`);
        if (!cancelled) setProperty(res.data);
      } catch (err) {
        if (!cancelled) {
          const status = err.response?.status;
          if (status === 404) {
            setError("not_found");
          } else {
            setError(
              err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Failed to load property."
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [id]);

  // -- Loading --
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Spinner />
      </div>
    );
  }

  // -- Not found --
  if (error === "not_found") {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
        <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-10 text-center max-w-md w-full shadow-sm">
          <p className="font-MerriweatherSans text-[22px] text-[#122B49] mb-2">
            Listing not found
          </p>
          <p className="font-Inter text-[14px] text-[#7A7A7A] mb-6">
            This property may have been removed or is no longer available.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#122B49] text-white font-Inter font-medium text-[14px] px-6 py-3 rounded-[8px] hover:bg-[#091524] transition-colors"
          >
            Browse all listings
          </Link>
        </div>
      </div>
    );
  }

  // -- Generic error --
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
        <div className="bg-white rounded-[14px] border border-red-200 p-10 text-center max-w-md w-full shadow-sm">
          <p className="font-Inter text-[16px] text-red-600 font-medium mb-1">
            Something went wrong
          </p>
          <p className="font-Inter text-[13px] text-[#7A7A7A] mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block bg-[#122B49] text-white font-Inter text-[13px] px-5 py-2 rounded-[6px] hover:bg-[#091524] transition-colors"
          >
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  // -- Render property --
  const loc     = property.location ?? {};
  const feat    = property.features ?? {};
  const pricing = property.pricing ?? {};

  const isRent      = (property.property_for || "").toLowerCase() === "rent";
  const badgeVariant = isRent ? "rent" : "sale";
  const title       = [property.bhk_type, property.property_subtype || property.property_type || "Property"]
    .filter(Boolean)
    .join(" ");
  const locationParts = [loc.building, loc.locality, loc.landmark, loc.city].filter(Boolean);
  const locationText  = locationParts.join(", ") || "Location not specified";

  const hasMap = loc.lat != null && loc.lng != null;
  const hasFeatures = property.features != null;
  const hasPricing  = property.pricing != null;

  const postedDate = property.created_at
    ? new Date(property.created_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero banner */}
      <div className="bg-[#122B49] pt-16 pb-10 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[#CBD5E1] font-Inter text-[13px] hover:text-white transition-colors mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to listings
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            {property.property_for && (
              <Badge label={property.property_for} variant={badgeVariant} />
            )}
            {property.property_type && (
              <Badge label={property.property_type} variant="neutral" />
            )}
          </div>

          <h1 className="font-MerriweatherSans font-normal text-[28px] md:text-[34px] text-white leading-snug">
            {title}
          </h1>

          {locationParts.length > 0 && (
            <div className="flex items-start gap-2 mt-3">
              <svg className="flex-shrink-0 mt-0.5" width="13" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#94A3B8"/>
              </svg>
              <p className="font-Inter text-[14px] text-[#94A3B8]">{locationText}</p>
            </div>
          )}

          {postedDate && (
            <p className="font-Inter text-[12px] text-[#64748B] mt-3">
              Listed on {postedDate}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-10 flex flex-col gap-8">

        {/* Price card */}
        {hasPricing && (
          <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-Inter text-[12px] uppercase tracking-widest text-[#7A7A7A] mb-1">
                  {isRent ? "Monthly Rent" : "Sale Price"}
                </p>
                {pricing.rent != null ? (
                  <p className="font-MerriweatherSans text-[32px] text-[#122B49] leading-none">
                    Rs.{" "}
                    <span className="font-semibold">
                      {Number(pricing.rent).toLocaleString("en-IN")}
                    </span>
                    {isRent && (
                      <span className="font-Inter text-[14px] text-[#7A7A7A] font-normal ml-1.5">/mo</span>
                    )}
                  </p>
                ) : (
                  <p className="font-MerriweatherSans text-[22px] text-[#7A7A7A]">Price on request</p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="flex flex-col gap-2 text-right">
                {pricing.security_deposit != null && (
                  <div>
                    <span className="font-Inter text-[11px] text-[#7A7A7A] uppercase tracking-wider">Security Deposit</span>
                    <p className="font-Inter text-[15px] font-medium text-[#122B49]">
                      Rs. {Number(pricing.security_deposit).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
                {pricing.maintenance === "Extra Maintenance" && pricing.maintenance_price != null && (
                  <div>
                    <span className="font-Inter text-[11px] text-[#7A7A7A] uppercase tracking-wider">
                      Maintenance ({pricing.maintenance_type || "Extra"})
                    </span>
                    <p className="font-Inter text-[15px] font-medium text-[#122B49]">
                      Rs. {Number(pricing.maintenance_price).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
                {pricing.maintenance === "Included in Rent" && (
                  <div>
                    <span className="font-Inter text-[12px] text-emerald-600 font-medium">Maintenance included in rent</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Property details */}
        <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm p-6">
          <SectionHeading>Property Details</SectionHeading>
          <div className="flex flex-col gap-3">
            <DetailRow label="Listed For"     value={property.property_for} />
            <DetailRow label="Type"           value={property.property_type} />
            <DetailRow label="Subtype"        value={property.property_subtype} />
            <DetailRow label="Configuration"  value={property.bhk_type} />
            <DetailRow label="Property Age"   value={property.property_age} />
          </div>
        </div>

        {/* Location */}
        {property.location != null && (
          <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm p-6">
            <SectionHeading>Location</SectionHeading>
            <div className="flex flex-col gap-3 mb-6">
              <DetailRow label="Building"  value={loc.building} />
              <DetailRow label="Locality"  value={loc.locality} />
              <DetailRow label="Landmark"  value={loc.landmark} />
              <DetailRow label="City"      value={loc.city} />
            </div>

            {/* Map */}
            {hasMap && (
              <div className="rounded-[10px] overflow-hidden border border-[#E5E7EB]" style={{ height: 280 }}>
                <MapContainer
                  center={[loc.lat, loc.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[loc.lat, loc.lng]}>
                    <Popup>{locationText}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        )}

        {/* Features & Amenities */}
        {hasFeatures && (
          <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm p-6">
            <SectionHeading>Features & Amenities</SectionHeading>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <FeatureChip icon="🐾" label="Pets Allowed"       active={feat.is_pets_allowed} />
              <FeatureChip icon="🚗" label="Reserved Parking"   active={feat.reserved_parking} />
              <FeatureChip icon="📹" label="CCTV"               active={feat.cctv} />
              <FeatureChip icon="💧" label={feat.water_supply ? `Water: ${feat.water_supply}` : "Water Supply"} active={feat.water_supply != null} />
              <FeatureChip icon="⚡" label={feat.electricity    ? `Power: ${feat.electricity}`  : "Electricity"}  active={feat.electricity  != null} />
            </div>
          </div>
        )}

        {/* Bottom back link */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-Inter text-[14px] text-[#122B49] hover:underline"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to all listings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
