const express = require("express");
const mongoose = require("mongoose");

const app = express();

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/requests", requestRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/ProjectManagementSystem");
}

main()
.then(() => {
    console.log("Connection Successful");
})
.catch((err) => {
    console.log(err);
});

app.get("/api", (req, res) => {
    res.json({
        users: ["Userone", "Usertwo", "Userthree"]
    });
});

app.use("/auth", authRoutes);

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});