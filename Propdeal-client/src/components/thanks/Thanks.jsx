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
    <div className="w-[51.813rem] font-Inter font-normal text-[#000000D9] h-[24.563rem] mt-[10.125rem] ml-[7.438rem] ">
      <div className="h-1/2">
        <h1 className="text-[24px]">
          Thank you for listing your property with us,
        </h1>
        <p className="text-[18px] my-[2rem]">
          {" "}
          Your listing will be reviewed and will go live within 24 hours.
        </p>
        <p className="text-[18px]">
          {" "}
          We will now manage your listing and get in touch with you after
          finding the best suitable tenant as per your preference.
        </p>
      </div>
      <div className="mt-[2.5rem] flex flex-col space-y-[1rem]">
        <h1 className="font-JF font-normal text-[16px] text-[#122B49]">
          -Dylan Estates
        </h1>
        <input className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter font-normal text-[#00000040] text-[14px] border-[#7A7A7A] rounded-[2px] w-[19.25rem]" />
        <div className="flex flex-row  w-[28.375rem] text-[16px] font-Inter font-normal justify-between h-[43px]">
          <button onClick={handleEdit} className="w-[12.938rem] bg-[#122B49] text-[#FFFFFF] rounded-[8px] text-center">
            Edit Property Listing
          </button>
          <button onClick={handlePreview} className="w-[12.938rem] bg-[#122B49] text-[#FFFFFF] rounded-[8px] text-center">
            Preview Property Listing
          </button>
        </div>
      </div>
    </div>
  );
}

export default Thanks
