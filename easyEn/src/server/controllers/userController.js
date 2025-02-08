import ApiError from "../Error/ApiErrors.js";
import bcrypt from 'bcrypt'
import { models } from '../models/models.js';
import jwt from 'jsonwebtoken'
const {User, TestResult} = models;

class UserController {
    async registration (req, res,next){
        const { username, email, password, role} = req.body;
        
        if(!email || !password){
            return next(ApiError.badRequest("Not find email or passwrod"))
        } 

        const candidate = await User.findOne({where: {email}})
            if(candidate){
                return next(ApiError.badRequest("This email already have "))
            }

            const hashPassword = await bcrypt.hash(password, 5)

            const user =await User.create({username, email , role,  password: hashPassword})

            const testResult = await TestResult.create({UserID:user.id});

            const token = jwt.sign({id: user.id,username, email, role}, process.env.SECRET_KEY,
                {expiresIn: '24h'}
            )
            return res.json(token)
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