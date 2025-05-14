import ApiError from "../Error/ApiErrors.js";

const Middleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err); 
      }
    
    
      if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
      }
    
      
      return res.status(500).json({ message: "Непредвиденная ошибка: " + err.message });
}

export default Middleware;