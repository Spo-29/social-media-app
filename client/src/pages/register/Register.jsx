import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!inputs.username || !inputs.email || !inputs.password || !inputs.name) {
      setErr("Fill in all fields");
      return;
    }

    // Validate email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputs.email)) {
      setErr("Wrong pattern for email");
      return;
    }

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err?.response?.data ||
        err?.message ||
        "Registration failed. Please try again.";
      setErr(errorMessage);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>
            Join our community! Create your free account and start sharing your
            moments with friends, discover new content, and connect with people
            who inspire you.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
