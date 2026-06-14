import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserClick = () => {
    const token = localStorage.getItem("pd_token");
    if (token) {
      navigate("/preview");
    } else {
      navigate("/more-detail");
    }
  };

  const activeClass = "underline underline-offset-8 decoration-2 decoration-black";
  const hoverClass = "hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-black";

  return (
    <div className="w-full h-[72px] fixed top-0 left-0 flex flex-row justify-between border-[1px]  border-[#F6EFE6] bg-[#FCF8F4]">
      <Link to="/" className="flex flex-col mt-2 ml-16">
        <img className="w-[48px] h-[28px]" src="/logodylan.png" alt="PropertyDeal logo" />
        <h1 className="font-Merriweather font-bold text-[#B0854C] text-[18px]">
          PropertyDeal
        </h1>
      </Link>
      <div className="h-[1.75rem] flex-1 font-Inter font-bold mt-[2rem] flex flex-row items-center justify-end space-x-6 px-3 mr-[3.75rem]">
        <div className="h-full w-auto ">
          <Link
            to="/"
            className={`${
              location.pathname === "/" ? activeClass : ""
            } ${hoverClass}`}
          >
            PROPERTIES
          </Link>
        </div>
        <div className="h-full w-auto ">
          <Link
            to="/preview"
            className={`${
              location.pathname === "/preview" ? activeClass : ""
            } ${hoverClass}`}
          >
            MY DASHBOARD/ACTIVITY{" "}
          </Link>
        </div>{" "}
        <div className="h-full w-auto ">
          <Link
            to="/more-detail"
            className={`${
              location.pathname === "/more-detail" ? activeClass : ""
            } ${hoverClass}`}
          >
            LIST YOUR PROPERTY
          </Link>
        </div>{" "}
        <div className="w-[1.5rem] h-0 -rotate-90 bg-black border-[1.4px] border-[#000000]"></div>
        <div className="flex flex-row space-x-8">
          <button onClick={handleUserClick}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="#122B49" strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#122B49" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
