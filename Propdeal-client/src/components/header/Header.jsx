import React, { useState } from "react";

function Header() {
  const [isActive, setIsActive] = useState("h3");

  const handleHeadingclick = (id) => {
    setIsActive(id);
  };

  return (
    <div className="w-full h-[72px] fixed top-0 left-0 flex flex-row justify-between border-[1px]  border-[#F6EFE6] bg-[#FCF8F4]">
      <div className="flex flex-col mt-2 ml-16">
        <img className="w-[48px] h-[28px]" src="logodylan.png" />
        <h1 className="font-Merriweather font-bold text-[#B0854C] text-[18px]">
          Dylan Estate
        </h1>
      </div>
      <div className="h-[1.75rem] md:w-[59.438rem] font-Inter font-bold mt-[2rem] flex flex-row space-x-8 px-3  mr-[3.75rem]">
        <div className="h-full w-auto ">
          <button
            id="h1"
            className={`${
              isActive === "h1"
                ? " underline underline-offset-8 decoration-2 decoration-black"
                : ""
            }  hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-black`}
            onClick={() => {
              handleHeadingclick("h1");
            }}
          >
            PROPERTIES
          </button>
        </div>
        <div className="h-full w-auto ">
          <button
            id="h2"
            className={`${
              isActive === "h2"
                ? "underline underline-offset-8 decoration-2 decoration-black"
                : ""
            } hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-black`}
            onClick={() => {
              handleHeadingclick("h2");
            }}
          >
            MY DASHBOARD/ACTIVITY{" "}
          </button>
        </div>{" "}
        <div className="h-full w-auto ">
          <button
            id="h3"
            className={`${
              isActive === "h3"
                ? " underline underline-offset-8 decoration-2 decoration-black"
                : ""
            }  hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-black`}
            onClick={() => {
              handleHeadingclick("h3");
            }}
          >
            LIST YOUR PROPERTY
          </button>
        </div>{" "}
        <div className="h-full w-auto ">
          <button
            id="h4"
            className={`${
              isActive === "h4"
                ? "underline underline-offset-8 decoration-2 decoration-black"
                : ""
            } hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-black`}
            onClick={() => {
              handleHeadingclick("h4");
            }}
          >
            CONTACT US
          </button>
        </div>
        <div className="h-full w-auto ">
          <button
            id="h5"
            className={`${
              isActive === "h5"
                ? "underline underline-offset-8 decoration-2 decoration-black"
                : ""
            } hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-black`}
            onClick={() => {
              handleHeadingclick("h5");
            }}
          >
            MORE
          </button>
        </div>
        <div className="w-[1.5rem] h-0 mt-2  -rotate-90 bg-black border-[1.4px] border-[#000000]"></div>
        <div className="flex flex-row space-x-8">
          <img className="h-[24px] w-[24px]" src="language.png" />
          <img className="h-[21px] w-[21px]" src="userlogo.png" />
        </div>
      </div>
    </div>
  );
}

export default Header;
