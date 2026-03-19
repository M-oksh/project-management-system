import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (req,res) => {

    // console.log(res.data.message);

    try {

      const res = await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert(res.data.message);

      // After register → go to login
      navigate("/");

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div>

      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Register
      </button>

      <p onClick={() => navigate("/")}>
        Already have an account? Login
      </p>

    </div>

  );

}

export default Register;