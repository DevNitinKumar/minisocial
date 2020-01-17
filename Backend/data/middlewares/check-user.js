const jwt = require("jsonwebtoken");


// generate the JWT token
module.exports.generateToken =  function(data) {
    return jwt.sign(data,"secret_key_will_go_there")     
} 


// authenticate if the token for the User is valid or not 
module.exports.isAuthenticated = function(req,res,next){
    jwt.verify(req.headers.authorization,"secret_key_will_go_there", function (err, decodedToken){
        if(err){
            res.status(200).json({ status: 200, success: false, message: "Authentication Failed", data: null })
        }else{
            req.decodedToken = decodedToken;
            next();
        }
    })
}


