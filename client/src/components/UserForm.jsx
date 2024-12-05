import React, { useState, useEffect } from "react";
import { fetchUserById, updateUser } from "../services/userService";
import { useParams, useNavigate } from "react-router-dom";

const UserForm = () => {
  const { id } = useParams(); // lấy id từ URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    occupation: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUserById(id);
      setUser(data);
    };
    getUser();
  }, [id]);

  // Xử lý sự thay đổi của các input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Xử lý khi nhấn nút Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(id, user); // Gửi yêu cầu cập nhật thông tin
    navigate("/admin"); // Điều hướng về trang admin sau khi cập nhật
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={user.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Occupation</label>
          <input
            type="text"
            name="occupation"
            value={user.occupation}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UserForm;