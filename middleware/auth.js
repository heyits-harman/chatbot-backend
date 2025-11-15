import jwt from 'jsonwebtoken';

const authValidation = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")){
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if(err){
        return res.status(401).json({error: "User not Authorized!"});
      }
      req.userId = decoded.userId;
      next();
    });
  }
  else{
    return res.status(401).json({error: "Token not provided or token format invalid!"});
  }
}

export default authValidation;