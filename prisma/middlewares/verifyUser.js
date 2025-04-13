import jwt from "jsonwebtoken";
function verify(req, res, next) {
  console.log("Backend Triggered");
  const { login_cookie } = req.cookies;

  jwt.verify(login_cookie.jwtToken, process.env.JWT_PASSWORD, (error, data) => {
    if (data) {
      req.user = data;
      next();
    } else {
      res.status(401).json({ message: "unathorised access !!!" });
    }
  });
}
export default verify;
