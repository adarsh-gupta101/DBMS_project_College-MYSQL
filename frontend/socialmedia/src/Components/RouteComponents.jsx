import React, { useEffect, useState } from "react";
import user from "../assets/people.svg";
import post from "../assets/posts.svg";
import friend from "../assets/buddies.svg";
import axios from "axios";

let user_id = localStorage.getItem("userID");

function RouteComponents() {
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/userdetails?user_id=${user_id}`)
      .then((res) => {
        console.log(res);
        setUserDetails(res.data);
      });
  }, []);

  const sections = [
    {
      users: user,
      name: "Users",
    },
    {
      posts: post,
      name: "Posts",
    },

    {
      friends: friend,
      name: "Friends",
    },
  ];
  return (
    <div>
      {userDetails && (
<div> 
        <p className='font-semibold text-xl text-right p-2'>
          Welcome {userDetails[0]?.name}
        </p>
        <p onClick={()=>{
          localStorage.removeItem("userID");
          window.location.href="/";
        }} className="text-right font-bold p-2 text-blue-500">Log Out</p>
        </div>

      )}

      <div className='flex md:flex-row justify-center pt-8'>
        <div className='w-1/6 shadow-lg p-2 bg-white justify-center flex-row items-center mx-4 rounded hover:shadow-sm hover:shadow-blue-300' >
        <a href="/allusers">
   <img src={user} alt='user' className='h-3/4' />
          <h2 className='text-center' >Users</h2>
        </a>
        </div>
        <div className='w-1/6 shadow-lg p-2 bg-white justify-center flex-row items-center mx-4 rounded hover:shadow-sm hover:shadow-blue-300'>
        <a href="/allposts">

          <img src={post} alt='post' className='h-3/4' />
          <h2 className='text-center'>Posts</h2>
          </a>
        </div>
        <div className='w-1/6 shadow-lg p-2 bg-white justify-center flex-row items-center mx-4 rounded hover:shadow-sm hover:shadow-blue-300'>
          <img src={friend} alt='friend' className='h-3/4' />
          <h2 className='text-center'>Friends</h2>
        </div>
      </div>
    </div>
  );
}

export default RouteComponents;
