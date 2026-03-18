const express = require("express");
const router = express.Router();

const Project = require("../models/Project");


/*
Create Project
*/
router.post("/create", async (req, res) => {

    try {

        const { name, description, owner } = req.body;

        const project = new Project({
            name,
            description,
            owner,
            members: [owner]
        });

        await project.save();

        res.json({
            message: "Project created successfully",
            project
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/*
Get All Projects of a User
*/
router.get("/user/:userId", async (req, res) => {

    try {

        const projects = await Project.find({
            members: req.params.userId
        });

        res.json({
            projects
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.post("/add-member", async (req, res) => {

    try {

        const { projectId, memberId } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Prevent duplicate members
        if (project.members.includes(memberId)) {
            return res.json({
                message: "Member already in project"
            });
        }

        project.members.push(memberId);

        await project.save();

        res.json({
            message: "Member added to project successfully",
            project
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.get("/:projectId", async (req, res) => {

    try {

        const project = await Project
            .findById(req.params.projectId)
            .populate("members", "name email");

        res.json(project);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

module.exports = router;