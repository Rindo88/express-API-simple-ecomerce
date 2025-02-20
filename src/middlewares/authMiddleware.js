import jwt from "jsonwebtoken";

const authVerif = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if(!token) return res.status(401).send({message: 'access denied! require token'});

  jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
    if(error){
      if(error.name == 'TokenExpiredError'){
        res.status(401).send({message: 'token has expired, please login again'});
      }
      res.status(401).send({message: 'invalid token'});
    }
    req.user = decode;
    next();
  })

}
export default authVerif;