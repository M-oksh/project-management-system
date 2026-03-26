function TaskCard({ task, updateStatus }) {

  // Priority color
  const getPriorityColor = () => {
    if (task.priority === "high") return "#ff4d4d";
    if (task.priority === "medium") return "#ffd633";
    if (task.priority === "low") return "#66cc66";
    return "#ccc";
  };

  // 🔥 Deadline logic
  const getDeadlineColor = () => {
    if (!task.deadline) return "#000";

    const today = new Date();
    const deadline = new Date(task.deadline);

    today.setHours(0,0,0,0);
    deadline.setHours(0,0,0,0);

    if (deadline < today) return "red";        // overdue
    if (deadline.getTime() === today.getTime()) return "orange"; // today
    return "green"; // future
  };

  return (

    <div style={{
      border: "1px solid black",
      margin: "10px",
      padding: "10px",
      background: "#f9f9f9",
      borderLeft: `6px solid ${getPriorityColor()}`
    }}>

      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>

      {/* 🔥 Deadline display */}
      {task.deadline && (
        <p style={{ color: getDeadlineColor() }}>
          Deadline: {new Date(task.deadline).toLocaleDateString()}
        </p>
      )}

      <p>Assigned: {task.assignedTo?.name || "Unassigned"}</p>

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

  );
}

export default TaskCard;