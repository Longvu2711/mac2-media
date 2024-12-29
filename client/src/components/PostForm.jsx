import React, { useState, useEffect } from "react";
import { fetchPostById, updatePost } from "../services/postService";
import { useParams, useNavigate } from "react-router-dom";

const PostForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState({
    firstName: "",
    lastName: "",
    location: "",
    description: "",
  });


  
  useEffect(() => {
    const getPost = async () => {
      const data = await fetchPostById(id);
      setPost(data);
    };
    getPost();
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePost(id, post); 
    navigate("/admin"); 
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Author First Name</label>
          <input
            type="text"
            name="firstName"
            value={post.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Author Last Name</label>
          <input
            type="text"
            name="lastName"
            value={post.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={post.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default PostForm;