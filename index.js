import express, { response } from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import Validate from "./middlewares/validateUser.js";
import jwt from "jsonwebtoken";
import verify from "./prisma/middlewares/verifyUser.js";
import getUserId from "./middlewares/getUserId.js";
import cors from "cors";
import { Select } from "@mui/material";

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

  var foundIdentifier = await prisma.User.findFirst({
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
  const { title, description, content, saveImage } = req.body;
  const { userId } = req.user;
  try {
    const createdBlog = await prisma.blog.create({
      data: {
        saveImage,
        title,
        description,
        content,
        authorId: userId,
      },
    });
    const blogId = createdBlog.blogId;
    res
      .status(201)
      .json({ message: "Your Blog was successfuly created", blogId });
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

app.get("/articles/:id", verify, async (req, res) => {
  const { id } = req.params;
  const blog_data = await prisma.blog.findFirst({
    where: {
      blogId: id,
    },
  });
  if (blog_data) {
    res.status(201).json({
      blog_data,
    });
  } else {
    res.status(500).json({
      mesage: "Someting went wrong",
    });
  }
});

app.get("/bloglisting/:id", [verify, getUserId], async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;
  try {
    const fetched_Posts = await prisma.blog.findMany({
      where: { blogId: id },
      select: {
        blogId: true,
        title: true,
        description: true,
        content: true,
        saveImage: true,
        updatedAt: true,
        user: {
          select: {
            firstName: true,
            id: true,
          },
        },
      },
    });
    res.status(200).json({
      data: [fetched_Posts, userId],
    });
  } catch (e) {
    res.status(500).json({ message: "something went wrong...." });
  }
});

app.get("/myblogs/:id", verify, async (req, res) => {
  try {
    const authorId = req.params.id;
    const myBlogs = await prisma.blog.findMany({
      where: {
        authorId,
      },
    });
    res.status(200).json({
      data: [myBlogs],
    });
  } catch (e) {
    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
});

app.get("/updateblog/:id", verify, async (req, res) => {
  try {
    const blogId = req.params.id;
    const UpdateBlog = await prisma.blog.findFirst({
      where: {
        blogId,
      },
    });
    res.status(200).json({
      data: [UpdateBlog],
    });
  } catch (e) {
    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
});

app.patch("/update/:id", verify, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, content, saveImage } = req.body;
    const updatedBlog = await prisma.blog.update({
      where: {
        blogId: id,
      },
      data: {
        saveImage: saveImage && saveImage,
        title: title && title,
        description: description && description,
        content: content && content,
      },
    });
    res.status(200).json({
      message: "Your Post Was Updated Successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "Something Went Wrong ....",
    });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000...");
});
