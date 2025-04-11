import { PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();
async function Validate(req, res, next) {
  const { email, username } = req.body;
  try {
    const foundEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (foundEmail) {
      return res
        .status(400)
        .json({ message: "User with the same email found !!" });
    }
    const foundUsername = await prisma.user.findFirst({
      where: { username },
    });
    if (foundUsername) {
      return res
        .status(400)
        .json({ message: "User with the same username found !!" });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: "mmmh.... something went wrong" });
  }
}

export default Validate;
