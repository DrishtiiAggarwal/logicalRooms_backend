import express from "express";
import type {Request,Response} from "express";


const app = express();
const port : Number = 8080

app.get("/",(req : Request,res : Response)=>{
    res.status(200).send("working fine!")
})

app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port} `)
})
