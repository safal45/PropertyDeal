import React, { useState } from 'react'
import Form1 from './Form1';
import Form2 from './Form2';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Home() {

     const navigate = useNavigate();

     const handleClick = () => {
       navigate("/more-detail");
     };
  const [role, setRole] = useState("owner");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("India");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      role,
      name,
      country,
      countryCode,
      phone,
      email,
    };
    await axios.post("http://localhost:5000/submit", formData);
    setIsClicked(false)
  };

  


  const [isClicked, setIsClicked] = useState(true);

  return (
    <div className="w-full h-[123vh]  pt-16 flex flex-col  bg-[#122B49]">
      <div className="flex flex-col md:w-[51.31rem] mt-[3.5rem]  font-MerriweatherSans text-[#ffffff] ml-[7.25rem] font-MerriweatherSans space-y-[1rem]">
        <h1 className="text-[32px] font-normal">
          Sell or Rent your Property For Free
        </h1>
        <p className="text-[16px] font-light">
          {" "}
          Whether you’re ready to sell or looking for answers, we’ll guide you
          with data and expertise specific to your needs.
        </p>
      </div>
      <div className="flex flex-row md:w-[66.75rem] items-center md:h-[23.5rem] md:space-x-[6rem] md:ml-[11.625rem] mt-[1.75rem]">
        <div className="w-[22.75rem] h-[21.56rem] font-MerriweatherSans pr-2 text-[#ffffff]">
          <h1 className="font-normal text-[20px]">
            Upload your property in 4 simple steps
          </h1>
          <div className="flex flex-row items-center">
            <img className="w-[46px] h-[39px]" src="righttick.png" />
            <p className="text-[14px] font-normal">
              Add your properties{" "}
              <span className="font-bold">Basic Details </span>{" "}
            </p>
          </div>
          <div className="flex flex-row items-center">
            <img className="w-[46px] h-[39px]" src="righttick.png" />
            <p className="text-[14px] font-normal">
              Add property <span className="font-bold">Location</span>{" "}
            </p>
          </div>
          <div className="flex flex-row items-center">
            <img className="w-[46px] h-[39px]" src="righttick.png" />
            <p className="text-[14px] font-normal">
              Add property{" "}
              <span className="font-bold"> Features and amenities</span>{" "}
            </p>
          </div>
          <div className="flex flex-row items-center">
            <img className="w-[46px] h-[39px]" src="righttick.png" />
            <p className="text-[14px] font-normal">
              Add <span className="font-bold">Price details </span>{" "}
            </p>
          </div>
          <div className="flex flex-row items-center">
            <img className="w-[46px] h-[39px]" src="righttick.png" />
            <p className="text-[14px] font-normal">
              Add your best <span className="font-bold">Property Shots </span>{" "}
            </p>
          </div>
        </div>
        <div className=" flex flex-col w-[38rem] h-[23.5rem]  border-[1px] bg-[#ffffff] rounded-[16px]">
          <div className="w-full h-[4.25rem] flex items-center bg-[#FCF8F4] rounded-t-[16px]">
            <h1 className="font-MerriweatherSans font-normal md:ml-[4.25rem] text-[20px] text-[#122B49]">
              LETS GET YOU STARTED !
            </h1>
          </div>
          {isClicked ? (
            <div>
              <form onSubmit={handleSubmit}>
                <div className="w-full h-[16rem] overflow-y-auto overflow-x-hidden">
                  <div className="w-full h-[43.063rem] bg-[#ffffff]">
                    <div className="mt-[2rem] ml-[3rem] flex flex-col">
                      <lable className="font-Inter font-medium text-[18px]">
                        {" "}
                        <span className="text-[#FF4D4F] ml-[2px]">*</span> I am
                        :
                      </lable>
                      <div className="flex w-full flex-row w-full mt-1 ml-2 justify-between">
                        <div className="flex w-1/2 font-Inter font-normal text-[16px] items-center">
                          <input
                            type="radio"
                            value="owner"
                            checked={role === "owner"}
                            onchange={() => setRole("owner")}
                            className="mr-4 h-[26px] w-[26px]"
                          />
                          Owner
                        </div>
                        <div className="flex w-1/2 font-Inter font-normal text-[16px] items-center ">
                          <input
                            type="radio"
                            value="builder"
                            check={role === "builder"}
                            onchange={() => setRole("builder")}
                            className="mr-5 h-[26px] w-[26px]"
                          />
                          Builder
                        </div>
                      </div>
                    </div>
                    <div className="mt-[3.5rem] flex flex-col ml-[3rem]">
                      <label className="font-Inter font-medium text-[18px]">
                        Your Name
                        <span className="text-[#FF4D4F] ml-[2px]">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter font-normal text-[#122B49] text-[14px] border-[#7A7A7A] rounded-[2px] w-[23.75rem]"
                        required
                      />
                    </div>
                    <div className="mt-[3.5rem] flex flex-col ml-[3rem]">
                      <label className="font-Inter font-medium text-[18px]">
                        Country
                        <span className="text-[#FF4D4F] ml-[2px]">*</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter bg-[#ffffff] font-normal text-[#122B49] text-[14px] border-[#7A7A7A] rounded-[2px] w-[23.75rem]"
                        required
                      >
                        <option
                          value="India"
                          className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter font-normal text-[#122B49] text-[14px] border-[#7A7A7A] rounded-[2px] w-[23.75rem]"
                        >
                          India
                        </option>
                      </select>
                    </div>
                    <div>
                      <div className="mt-[3.5rem] flex flex-col ml-[3rem]">
                        <label className="font-Inter font-medium text-[18px]">
                          Phone
                          <span className="text-[#FF4D4F] ml-[2px]">*</span>
                        </label>
                        <div className="w-full flex flex-row items-center">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className=" h-[40px] mt-2 w-[3.93rem] mr-2 bg-[#ffffff] outline-none font-Roboto font-normal border-[1px] rounded-[2px] text-[#122B49] text-[16px] border-[#7A7A7A] rounded-[2px] "
                          >
                            <option
                              value="+91"
                              className="font-Inter font-normal text-[#122B49] text-[14px] border-[1px] border-[#7A7A7A] rounded-[2px]"
                            >
                              +91
                            </option>
                          </select>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="000-000-0000"
                            className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter font-normal text-[#122B49] text-[14px] border-[#7A7A7A] rounded-[2px] w-[19.25rem]"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-[3.5rem] flex flex-col ml-[3rem]">
                        <label className="font-Inter font-medium text-[18px]">
                          Or Email
                          <span className="text-[#FF4D4F] ml-[2px]">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter font-normal text-[#122B49] text-[14px] border-[#7A7A7A] rounded-[2px] w-[23.75rem]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[4.25rem] flex justify-between items-center bg-[#FCF8F4] rounded-b-[16px]">
                  <h1 className="font-Inter font-normal ml-[1.25rem] text-[12px] text-[#7A7A7A]">
                    Need Help?{" "}
                    <span className=" text-[#000000] font-medium">
                      Call 9999999999
                    </span>
                  </h1>
                  <button
                    type="submit"                    
                    className="bg-[#122B49] hover:bg-[#091524] font-inter font-normal rounded-[8px] mr-[1.5rem] text-[#FFFFFF] w-[6.875rem] h-[2rem]"
                  >
                    NEXT
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="w-full h-[14rem]">
                <Form2 />
              </div>
              <div className="w-full h-[4.25rem] flex justify-between items-center bg-[#FCF8F4] rounded-b-[16px]">
                <h1 className="font-Inter font-normal ml-[1.25rem] text-[12px] text-[#7A7A7A]">
                  Need Help?{" "}
                  <span className=" text-[#000000] font-medium">
                    Call 9999999999
                  </span>
                </h1>
                  <button
                    onClick={ handleClick }
                  className="bg-[#122B49] hover:bg-[#091524] font-inter font-normal rounded-[8px] mr-[1.5rem] text-[#FFFFFF] w-[6.875rem] h-[2rem]"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home