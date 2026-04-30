const jwt = require("jsonwebtoken");

function readToken(req) {
    const authHeader = req.headers.authorization || "";

    if (req.cookies?.token) {
        return req.cookies.token;
    }

    if (authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }

    return null;
}

async function authArtist(req,res, next) {
    const token = readToken(req);

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.role !== "artist"){
            return res.status(403).json({
                message:" You dont have access to add music"
            })
        }

        req.user = decoded;
        next()
    }catch(err){
        console.log(err);
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
}

async function authUser(req,res,next) {
    const token = readToken(req);

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!["user", "artist"].includes(decoded.role)){
            return res.status(403).json({
                message:"You dont have access"
            })
        }
        req.user = decoded;

        next()


    }catch(err){
        console.log(err)
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

}
module.exports = {authArtist,authUser}
