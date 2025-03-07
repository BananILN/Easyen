import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const {User} = models

class ProfileController{
        async getAll(req,res,next){

                 const user = await User.findAll()
                 return res.json(user)
        }

        async getOne(req,res,next){
            const { id } =req.params;
            const user = await User.findByPk(id)

            if(!user){
                return next(ApiError.badRequest("Not found"))
            }
            return res.json(user)
        }
}

export default new ProfileController()