const express = require("express");
const app = express();
const mongoose = require("mongoose");

main()
    .then(()=>{
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ProjectManagementSystem');
}

app.get("/api" , (req,res) => {
    res.json({"users" : ["Userone","Usertwo","userthree"]});
});

app.listen(8080,() =>{
    console.log("server is listning to port 8080");
});