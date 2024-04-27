const express=require("express");

const app=express();

const port=process.env.PORT || 3001;

require('dotenv').config();

app.listen(port,()=>{

    console.log("server is listening to port: "+ port);
})


app.get("/v1/api/AdminRole",(req,res)=>{
    res.send("fetching");
    console.log("working")
})