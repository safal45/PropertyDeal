import React, { useState } from 'react'
import axios from 'axios'

function Form1() {

  const [role, setRole] = useState("owner");
  const [name, setName] = useState(' ');
  const [country, setCountry] = useState(' ');
  const [phone, setPhone] = useState(' ');
  const [email, setEmail] = useState(' ');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      role,
      name,
      country,
      phone,
      email,
    };
    await axios.post('http://localhost:5000/submit', formData);
    alert('Data Submitted Success');
  };

  return (
    <div className="w-full h-[43.063rem] bg-[#ffffff]">
      <form onSubmit={handleSubmit}>
        <div className="mt-[3.5rem] ml-[3rem] flex flex-col">
          <lable className="font-Inter font-medium text-[18px]">
            {" "}
            * I am :
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
            Your Name*
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
          <label className="font-Inter font-medium text-[18px]">Country*</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter font-normal text-[#122B49] text-[14px] border-[#7A7A7A] rounded-[2px] w-[23.75rem]"
            required
          />
        </div>
        <div>
          <div className="mt-[3.5rem] flex flex-col ml-[3rem]">
            <label className="font-Inter font-medium text-[18px]">Phone*</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="999-999-99999"
              className="h-[40px] pl-4 border-[1px] mt-2 outline-none font-Inter font-normal text-[#122B49] text-[14px] border-[#7A7A7A] rounded-[2px] w-[23.75rem]"
              required
            />
          </div>
          <div className="mt-[3.5rem] flex flex-col ml-[3rem]">
            <label className="font-Inter font-medium text-[18px]">Or Email*</label>
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
      </form>
    </div>
  );
}

export default Form1