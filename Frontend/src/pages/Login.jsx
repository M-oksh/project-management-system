import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      alert(res.data.message);

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div>

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p onClick={() => navigate("/register")}>
        Don't have an account? Register
      </p>

    </div>

  );

}

export default Login;