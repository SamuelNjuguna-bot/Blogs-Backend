import express, { response } from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import Validate from "./middlewares/validateUser.js";
import jwt from "jsonwebtoken";
import verify from "./prisma/middlewares/verifyUser.js";

import cors from "cors";

const app = express();
const prisma = new PrismaClient();
app.use(
  cors({
    origin: "http://localhost:5173",
    method: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.post("/signup", Validate, async (req, res) => {
  const { firstName, lastName, password, username, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const user = await prisma.User.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      message: "Sign Up Success !!",
    });
  } catch (e) {
    res.status(500).json({ mesage: "Something went Wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  const foundIdentifier = await prisma.User.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });
  if (!foundIdentifier) {
    return res.status(400).json({ message: "Wrong email or username" });
  }

  if (foundIdentifier) {
    const isPasswordMatch = await bcrypt.compare(
      password,
      foundIdentifier.password,
    );
    if (isPasswordMatch) {
      const payload = {
        userId: foundIdentifier.id,
        username: foundIdentifier.username,
        email: foundIdentifier.email,
      };
      const jwtToken = jwt.sign(payload, process.env.JWT_PASSWORD);

      res.status(201).cookie("login_cookie", { jwtToken }).json({
        userId: foundIdentifier.id,
        firstName: foundIdentifier.firstName,
        lastName: foundIdentifier.LastName,
        email: foundIdentifier.email,
        username: foundIdentifier.username,
      });
    } else {
      return res.status(400).json({ message: "Wrong Password !!" });
    }
  }
});

app.post("/createblog", verify, async (req, res) => {
  const { title, description, content } = req.body;
  const { userId } = req.user;
  console.log(userId, title, description, content);
  try {
    const createdBlog = await prisma.blog.create({
      data: {
        title,
        description,
        content,
        authorId: userId,
      },
    });
    res.status(201).json({ message: "Your Blog was successfuly created" });
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000...");
});
