function TaskCard({ task, updateStatus }) {

  return (

    <div style={{
      border: "1px solid black",
      margin: "10px",
      padding: "10px",
      background: "#f9f9f9"
    }}>

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

  );

}

export default TaskCard;