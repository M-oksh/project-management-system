import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import API from "../services/api";
import TaskCard from "../components/TaskCard";

function ProjectPage() {

  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [progress, setProgress] = useState(0);
  const [members, setMembers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [email, setEmail] = useState("");

  const handleAddMember = async () => {
    try {

      // find user by email
      const res = await API.post("/auth/find-user", { email });

      const userId = res.data.user._id;

      await API.post("/projects/add-member", {
        projectId: id,
        memberId: userId
      });

      alert("Member added");

      setEmail("");

      fetchMembers(); // refresh list

    } catch (err) {
      console.log(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setMembers(res.data.members);

      // default selection
      if (res.data.members.length > 0) {
        setAssignedTo(res.data.members[0]._id);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await API.get(`/projects/progress/${id}`);
      const value = parseFloat(res.data.progress); // convert "60.00%" → 60
      setProgress(value);
    } catch (err) {
      console.log(err);
    }
  };
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
    fetchProgress();
    fetchMembers();
  }, [id]);

  // Create task
  const handleCreate = async () => {
    try {

      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/tasks/create", {
        title,
        description,
        projectId: id,
        assignedTo: user._id,
        assignedTo,
        priority,
        deadline
      });

      setTitle("");
      setDescription("");
      fetchProgress();
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

      fetchProgress();
      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // Drag handler
  const handleDragEnd = async (result) => {

    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await updateStatus(taskId, newStatus);
  };

  // Split tasks
  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in-progress");
  const completedTasks = tasks.filter(t => t.status === "completed");

  return (

    <div>

      <h2>Project Tasks</h2>

      <input
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleAddMember}>
        Add Member
      </button>

      <h3>Project Members</h3>

      {members.map(member => (
        <div key={member._id}>
          {member.name} ({member.email})
        </div>
      ))}

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

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
        {members.map(member => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>

      <button onClick={handleCreate}>
        Add Task
      </button>

      <h3>Project Progress</h3>

      <div style={{
        width: "100%",
        height: "20px",
        background: "#ddd",
        borderRadius: "10px",
        marginBottom: "10px"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: "#4caf50",
          borderRadius: "10px",
          transition: "0.3s"
        }} />
      </div>

      <p>{progress}% completed</p>

      {/* Drag & Drop Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

          {/* TODO */}
          <Droppable droppableId="todo">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
                <h3>TODO</h3>

                {todoTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard task={task} updateStatus={updateStatus} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* IN PROGRESS */}
          <Droppable droppableId="in-progress">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
                <h3>IN PROGRESS</h3>

                {inProgressTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard task={task} updateStatus={updateStatus} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* COMPLETED */}
          <Droppable droppableId="completed">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
                <h3>COMPLETED</h3>

                {completedTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard task={task} updateStatus={updateStatus} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </div>

      </DragDropContext>

    </div>

  );
}

export default ProjectPage;