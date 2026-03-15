const express = require("express");
const router = express.Router();

const User = require("../models/user");
const JoinRequest = require("../models/JoinRequest");

router.post("/join-request", async (req, res) => {

    try {

        const { memberId, headEmail } = req.body;

        const head = await User.findOne({ email: headEmail });

        if (!head) {
            return res.json({
                message: "Head not found"
            });
        }

        // Check if request already exists
        const existingRequest = await JoinRequest.findOne({
            memberId,
            headId: head._id
        });

        if (existingRequest) {
            return res.json({
                message: "Request already sent"
            });
        }

        const newRequest = new JoinRequest({
            memberId,
            headId: head._id
        });

        await newRequest.save();

        res.json({
            message: "Request sent successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.get("/:headId", async (req, res) => {

    try {

        const requests = await JoinRequest
            .find({
                headId: req.params.headId,
                status: "pending"
            })
            .populate("memberId", "name email");

        res.json(requests);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.put("/approve/:requestId", async (req, res) => {

    try {

        const request = await JoinRequest.findById(req.params.requestId);

        if (!request) {
            return res.json({
                message: "Request not found"
            });
        }

        request.status = "approved";

        await request.save();

        res.json({
            message: "Request approved"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

module.exports = router;