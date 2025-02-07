import ApiError from "../Error/ApiErrors.js";

class UserController {
    async registration (req, res){

    }

    async login(req, res){

    }
    async cheeck(req, res, next){
        const {id} = req.query;
        if(!id){
            return next(ApiError.badRequest('Не задан ID'))
        }
        res.json(id)
    }
}
export default new UserController();