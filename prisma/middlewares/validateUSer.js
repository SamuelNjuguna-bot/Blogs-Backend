import { json } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function validate(res, req, next) {
  const { username, email } = req.body;
  console.log(username);

  try {
    const userFound = await prisma.User.findFirst({
      where: { username },
    });
    if (userFound) {
      res
        .status(401)
        .json({ message: "user with that username already exists" });
    } else {
      next();
    }
  } catch (e) {
    res.status(500).json({ message: "Mmmmh Something Went Wrong" });
  }
}
export default validate;
