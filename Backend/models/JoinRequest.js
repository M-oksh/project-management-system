const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({

    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    headId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("JoinRequest", joinRequestSchema);