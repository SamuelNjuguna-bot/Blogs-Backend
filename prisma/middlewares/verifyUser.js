import jwt from "jsonwebtoken";
function verify(req, res, next) {
  const { login_cookie } = req.cookies;
  if(login_cookie){
    jwt.verify(login_cookie.jwtToken, process.env.JWT_PASSWORD, (error, data) => {
      if (data) {
        req.user = data;
        next();
      } else {
        res.status(401).json({ message: "unathorised access !!!" });
      }
      if(error){
        res.status(500).json({
          message: "Somethin went wrong please try again later"
        })
      }
      
    });
  }
else{
  res.status(401).json({
    message:"Unauthorised please login or signUp to continue"
  })
}
}
export default verify;
