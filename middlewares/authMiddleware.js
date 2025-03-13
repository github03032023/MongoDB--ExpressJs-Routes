const authMiddleware = (req, res, next) =>{
    if(req.query){
        if(req.query.token === 'ValidToken'){
            next();
        }else{
            res.status(200).json({
                success: false,
                statusCode : 401,
                message : "Not Authorized!!!"
            })
        }
    }else{
        res.status(200).json({
            success: false,
            statusCode : 400,
            message : "Invalid Request!!!"

        })
    }
}

module.exports = authMiddleware;