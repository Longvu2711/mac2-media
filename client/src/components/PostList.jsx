import React, { useEffect, useState } from "react";
import { fetchPosts, deletePost } from "../services/postService";
import { useNavigate } from "react-router-dom";

const PostList = () => {

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    getPosts();
  }, []);

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts(posts.filter((post) => post._id !== id)); 
  };

  return (
    <div>
      <h2>Post Management</h2>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td>{post.firstName} {post.lastName}</td>
              <td>{post.description}</td>
              <td>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
                <button onClick={() => navigate(`/admin/post/edit/${post._id}`)}>
  Edit
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;