import express, { response } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import Validate from "./middlewares/validateUser.js"
import jwt from "jsonwebtoken"

import cors from "cors"
const app = express()
const prisma = new PrismaClient()
app.use(cors({
  origin:"http://localhost:5173",
  method:["POST","GET", "PATCH", "DELETE"],
  credentials:true
}))


app.use(express.json())


app.post("/signup",Validate, async(req, res)=>{
    const {firstName, lastName, password, username, email} = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    try{
      const user =await prisma.User.create({
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
    }
})

app.post("/login", async(req, res)=>{
     const {identifier, password} = req.body  
      
        const foundIdentifier =await prisma.User.findFirst({
          where: {
            OR:[{username : identifier}, {email:identifier}]
          }
        })
        if(!foundIdentifier){
          return  res.status(400).json({message:"Wrong email or username"})
        }

        if(foundIdentifier){
         const isPasswordMatch = await bcrypt.compare(password, foundIdentifier.password)
          if(isPasswordMatch){
            const payload={
              username: foundIdentifier.username,
              email: foundIdentifier.email
            }
         const jwtToken =   jwt.sign(payload, process.env.JWT_PASSWORD)

         res.status(201).cookie("login_cookie",{jwtToken}).json({message:"Cookie created Succesfuly"})
          }
          else{
         return   res.status(400).json({message:"Wrong Password !!"})
            
            }

        }
        

}) 

app.listen(3000, ()=>{
    console.log("server running on port 3000....")
})