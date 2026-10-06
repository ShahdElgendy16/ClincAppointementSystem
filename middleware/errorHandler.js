const errorHandler=(err,req,res,next)=>{
    console.error(err);

    if(err.name==="ZodError"){
        return res.status(400).json({
            message:"validation error",
            errors:err.issues
        })
    }
    res.status(500).json({message:"internalserver error"});
};
module.exports=errorHandler;