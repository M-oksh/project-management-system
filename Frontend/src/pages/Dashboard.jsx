import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get(`/projects/user/${user._id}`);
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create project
  const handleCreate = async () => {
    try {

      await API.post("/projects/create", {
        name,
        description,
        owner: user._id
      });

      setName("");
      setDescription("");

      fetchProjects();

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div>

      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      {/* Create Project */}
      <h3>Create Project</h3>

      <input
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleCreate}>
        Create Project
      </button>

      {/* Project List */}
      <h3>Your Projects</h3>

      {projects.map((proj) => (
        <div
          key={proj._id}
          onClick={() => navigate(`/project/${proj._id}`)}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
            cursor: "pointer"
          }}
        >
          <h4>{proj.name}</h4>
          <p>{proj.description}</p>
        </div>
      ))}

    </div>

  );

}

export default Dashboard;