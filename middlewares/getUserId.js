import jwt from "jsonwebtoken";
function getUserId(req, res, next) {
  const { login_cookie } = req.cookies;
  jwt.verify(login_cookie.jwtToken, process.env.JWT_PASSWORD, (error, data) => {
    if (data) {
      req.body = data;
      next();
    }
  });
}
export default getUserId;
