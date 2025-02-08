import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { Role } = models;

class RoleController{
    async create(req , res , next){
        try {
            
        const {rolename } = req.body;
        const role = await Role.create({RoleName: rolename})
        return res.json(role)

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res){
        const role = await Role.findAll()
        return res.json(role)
    }
}
export default new RoleController();


