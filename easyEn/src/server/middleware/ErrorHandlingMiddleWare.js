import ApiError from "../Error/ApiErrors.js";

const Middleware = (err, req, res, next) => {
    if( err instanceof ApiError){
        res.status(err.status).json( {message: err.message})
    }
    return res.status(500).json( {message:"Непридвиденная ошибка"})
}

export default Middleware;