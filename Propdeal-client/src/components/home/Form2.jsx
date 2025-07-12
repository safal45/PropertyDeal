import React from 'react'

function Form2() {
  return (
    <div className="w-full h-full">
      <div className=" h-[6rem] ml-[4.25rem] mt-[2.5rem] flex flex-col space-y-[1.75rem] w-[23.75rem] ">
        <span className="flex flex-row justify-between ">
          <h1 className="font-Inter font-medium text-[16px]">
            {" "}
            Enter OTP sent on Your Number
            <span className="text-[#FF4D4F] ml-[2px]">*</span>
          </h1>
          <p className="flex items-center underline underline-offset-1 justify-end font-Inter font-normal mt-3 text-[12px] text-[#122B49] ">
            {" "}
            Change{" "}
          </p>
        </span>
        <div className="w-full h-[4.375rem] flex flex-col">
          <div className="w-full h-[2.5rem] flex flex-col justify-center  border-[1px] rounded-[2px] border-[#7A7A7A] ">
            <p className="font-Inter font-normal ml-[.75rem]  text-[#00000040] text-[14px]">
              0 0 0 0 0
            </p>
          </div>
          <p className="flex items-center justify-end font-Inter font-normal mt-3 text-[12px] text-[#122B49] ">
            {" "}
            Resend OTP{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Form2; 