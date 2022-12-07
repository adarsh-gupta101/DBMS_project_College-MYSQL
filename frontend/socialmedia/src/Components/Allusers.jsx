import axios from "axios";
import React, { useEffect, useState } from "react";
import male from "../assets/male.svg";

function Allusers() {
  const [Allusers, setAllusers] = useState();
  useEffect(() => {
    axios.get("http://localhost:3000/allusers", {}).then((res) => {
      console.log(res.data);
      setAllusers(res.data);
    });
  });
  return (
    <div className='bg-gray-100'>
      <a href='/'>
        <p className='bg-black text-white p-2  mx-4 rounded shadow-sm w-fit'>
          Back to Home
        </p>
      </a>
      <div className=' min-h-screen flex justify-center items-center '>
        {Allusers &&
          Allusers.map((res) => {
            return (
              <div className='p-4 bg-white shadow-sm hover:shadow-xl shadow-pink-500  h-fit mt-4 m-2  w-1/5 '>
                <img
                  src={res.profile_picture || male}
                  className='shadow-lg rounded-full'></img>
                <p className='text-xl text-center mt-2 font-semibold'>
                  {res.name}
                </p>
                <p className='text-center'>{res.email}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Allusers;
