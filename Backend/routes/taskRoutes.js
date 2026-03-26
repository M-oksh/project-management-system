const express = require("express");
const router = express.Router();

const Task = require("../models/Task");


/*
Create Task
*/
router.post("/create", async (req, res) => {

    try {

        const { title, description, projectId, assignedTo, deadline, priority } = req.body;

        const task = new Task({
            title,
            description,
            projectId,
            assignedTo,
            deadline,
            priority
        });

        await task.save();

        res.json({
            message: "Task created successfully",
            task
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/*
Get Tasks of a Project
*/
router.get("/project/:projectId", async (req, res) => {

    try {

        const tasks = await Task
            .find({ projectId: req.params.projectId })
            .populate("assignedTo", "name email");

        res.json({
            tasks
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/*
Update Task Status
*/
router.put("/status/:taskId", async (req, res) => {

    try {

        const { status } = req.body;

        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.json({
                message: "Task not found"
            });
        }

        task.status = status;

        await task.save();

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.get("/user/:userId", async (req, res) => {

    try {

        const tasks = await Task
            .find({ assignedTo: req.params.userId })
            .populate("projectId", "name");

        res.json({
            tasks
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.delete("/:taskId", async (req, res) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.taskId);

        if (!task) {
            return res.json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

module.exports = router;