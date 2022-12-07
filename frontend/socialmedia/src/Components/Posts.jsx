import axios from "axios";
import React, { useEffect, useState } from "react";
import CommentCont from "./Comment";
const userID = localStorage.getItem("userID");

function Posts() {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState();

  const handleComment = (post_id) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    axios
      .post(`http://localhost:3000/comment`, {
        user_id: userID,
        post_id: post_id,
        comment_text: comment,
        comment_time: yyyy.toString() + "/" + mm + "/" + dd.toString(),
      })
      .then((res) => {
        console.log(res);
      });
  };

  //   const user=[{user_id:1,name:"joe"},{user_id:2,name:"joe2"}}]
  // an object user with key asţid ,name as name
  const user = [];
  const postLikeCount = [];

  const finduser = (user_id) => {
    const data = axios
      .get(`http://localhost:3000/userdetails?user_id=${user_id}`)
      .then((res) => {
        user.push({ user_id: user_id, name: res.data[0].name });
      });
  };

  const Like = (id) => {
    const liked = axios
      .post(`http://localhost:3000/likes`, { user_id: userID, post_id: id })
      .then((res) => {});
  };

  //   const find

  useEffect(() => {
    axios.get(`http://localhost:3000/posts`, {}).then((res) => {
      setPosts(res.data);
      // console.log(res);
    });

    posts.map((post) => {
      finduser(post.user_id);
    });

    // post like count
  }, [posts]);

  return (
    <div>
      {posts &&
        posts.reverse().map((post) => {
          return (
            <div className='bg-white shadow-lg rounded-lg p-4 my-4 w-1/2 m-auto'>
              <div className='flex'>
                <img
                  src={post.profile_picture}
                  className='rounded-full w-1/12'
                />
                <div className='flex flex-col'>
                  {" "}
                  <p className='text-gray-900 text-sm font-semibold'>
                    {post.username}
                  </p>
                  <p className='text-gray-500 text-sm'>@{post.username}</p>
                </div>
              </div>
              <h2 className='font-semibold text-xl mt-8'>{post.post_text}</h2>
              <section className='flex'>
                {" "}
                <p className='text-gray-500 text-sm pr-2 mt-8'>
                  {post.post_time}
                </p>
              </section>

              <section className='flex mt-4 cursor:pointer'>
                <p className='p-2 text-lg'>
                  <span
                    className='hover:text-2xl '
                    onClick={() => Like(post.post_id)}>
                    💖
                  </span>
                  {post.totallikes} Likes
                </p>
                <p className='p-2 text-lg'>
                  <span className='hover:text-2xl'>💭</span> 0 Comments
                </p>
              </section>
              {/* Comment box */}
              <CommentCont postid={post.post_id} />
            </div>
          );
        })}
    </div>
  );
}

export default Posts;
