import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function ProjectPage() {

  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/project/${id}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const handleCreate = async () => {
    try {

      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/tasks/create", {
        title,
        description,
        projectId: id,
        assignedTo: user._id
      });

      setTitle("");
      setDescription("");

      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // Update status
  const updateStatus = async (taskId, newStatus) => {
    try {

      await API.put(`/tasks/status/${taskId}`, {
        status: newStatus
      });

      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div>

      <h2>Project Tasks</h2>

      {/* Create Task */}
      <h3>Create Task</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleCreate}>
        Add Task
      </button>

      {/* Task List */}
      <h3>Tasks</h3>

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px"
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>

          <button onClick={() => updateStatus(task._id, "todo")}>
            Todo
          </button>

          <button onClick={() => updateStatus(task._id, "in-progress")}>
            In Progress
          </button>

          <button onClick={() => updateStatus(task._id, "completed")}>
            Completed
          </button>

        </div>
      ))}

    </div>

  );

}

export default ProjectPage;