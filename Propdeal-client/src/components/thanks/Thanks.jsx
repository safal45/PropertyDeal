import React from 'react'
import { useNavigate } from "react-router-dom";

function Thanks() {

    const navigate = useNavigate();

    const handleEdit = () => {
      navigate("/more-detail");
    };
    const handlePreview = () => {
      navigate("/preview");
    };
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
      <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm p-10 max-w-xl w-full font-Inter font-normal text-[#000000D9]">
        <h1 className="font-MerriweatherSans text-[24px] text-[#122B49]">
          Thank you for listing your property with us
        </h1>
        <p className="text-[16px] mt-6 text-[#4B5563] leading-relaxed">
          Your listing will be reviewed and will go live within 24 hours.
        </p>
        <p className="text-[16px] mt-3 text-[#4B5563] leading-relaxed">
          We will now manage your listing and get in touch with you after
          finding the best suitable tenant as per your preference.
        </p>
        <p className="font-Inter font-medium text-[15px] text-[#122B49] mt-8">
          — PropertyDeal
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleEdit}
            className="flex-1 bg-[#122B49] text-white font-Inter text-[14px] font-medium py-3 rounded-[8px] hover:bg-[#0a1e34] transition-colors text-center"
          >
            Edit Listing
          </button>
          <button
            onClick={handlePreview}
            className="flex-1 bg-white border border-[#122B49] text-[#122B49] font-Inter text-[14px] font-medium py-3 rounded-[8px] hover:bg-[#F0F4F8] transition-colors text-center"
          >
            View All Listings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Thanks
