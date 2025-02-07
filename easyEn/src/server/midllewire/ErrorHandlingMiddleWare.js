import apiError from "../Eror/apiError";

export default function Midlleware(err, req, res, next){
    if( err instanceof apiError){
        res.status(err.status).json( {message: err.message})
    }
    return res.status(500).json( {message:"Непридвиденная ошибка"})
}