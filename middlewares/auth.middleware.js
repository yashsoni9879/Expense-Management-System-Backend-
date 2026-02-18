var jwt = require("jsonwebtoken");

function authMidddleware(req, res, next) {
  //     try{
  //     if(!req.headers.authorization){
  //            return res.status(401).send({
  //         error: true,
  //         message: "Unauthorized"
  //     });
  //     }
  //     const token=req.headers.authorization.split(" ")[1];
  //     var decoded=jwt.verify(token,'shhhh');
  //     next();
  // }
  // catch(err){
  //     res.status(401).send({error:true,message:"unauthorized"})
  // }
  try {
    if (req.url.toString().indexOf("login") > -1) {
      next();
    } else {
      var decoded = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.JWT_SECRET,
      );
      next();
    }
  } catch (err) {
    res.status(401).send({ error: true, message: "unauthorized" });
  }
}
module.exports = { authMidddleware };
