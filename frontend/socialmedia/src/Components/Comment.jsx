import axios from "axios";
import React, { useEffect, useState } from "react";
const userID = localStorage.getItem("userID");

function CommentCont({ postid }) {
  const [comment, setComment] = useState();
  const [postcomments,setPostContent]=useState()


  let post_id=postid
//   alert(post_id)

  useEffect(() => {
    // get comments by post id
    axios
      .get(`http://localhost:3000/postcomments?post_id=${post_id}`)
      .then((res) => {
        setPostContent(res.data)
        console.log("res",res.data)
        console.log(postcomments)
      });
  },[postcomments]);
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

  return (
    <div>
      <section className='flex mt-4 w-11/12 m-auto'>
        <input
          type='text'
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          className='w-3/4 rounded-full border-2 border-gray-300 p-2'
          placeholder='Write a comment...'
        />
        <button
          onClick={() => handleComment(post_id)}
          className='bg-blue-800 text-white px-4 rounded'>
          {" "}
          Send
        </button>
      </section>

      <section>
        {/* show 3 comments */}
        {postcomments &&
          postcomments.map((comment) => {
            return <p className="text-center mt-8 bg-gray-100 w-fit m-auto  p-2 pr-8">{comment.comment_text}</p>;
          })}
      </section>
     


    </div>
  );
}

export default CommentCont;
