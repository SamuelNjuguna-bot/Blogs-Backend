import express from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
// import validate from "./prisma/middlewares/validateUSer.js"


const app = express()
const prisma = new PrismaClient()


app.use(express.json())


app.post("/signup", async(req, res)=>{
    const {firstName, lastName, password,username, email} = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    try{
      await prisma.User.create({
        data:{
            firstName,
            lastName,
            email,
            username,
            password:hashedPassword
       
        }
      })
      res.status(201).json({
        message:"Sign Up Success !!"
      })
    }
    catch (e){
      res.status(500).json({mesage:"Something went Wrong"})
      console.log(e)
    }
})



app.listen(3000, ()=>{
    console.log("server running on port 3000....")
})