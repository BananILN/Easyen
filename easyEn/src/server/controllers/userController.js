import ApiError from "../Error/ApiErrors.js";
import bcrypt from 'bcrypt'
import { models } from '../models/models.js';
import jwt from 'jsonwebtoken'
const {User, Lesson} = models;

const generateJwt =  (id, username, email, RoleID) =>{
    return jwt.sign({ id, username, email, RoleID }, process.env.SECRET_KEY, { expiresIn: '24h' });
}

class UserController {
    async registration(req, res, next) {
        const { username, email, password, RoleID } = req.body;
    
      
        if (!email || !password || !username) {
            return next(ApiError.badRequest("Email, password, and username are required"));
        }
    
        
        const emailCandidate = await User.findOne({ where: { email } });
        if (emailCandidate) {
            return next(ApiError.badRequest("This email is already in use"));
        }
    
    
        const usernameCandidate = await User.findOne({ where: { username } });
        if (usernameCandidate) {
            return next(ApiError.badRequest("This username is already in use"));
        } 
     
        const hashPassword = await bcrypt.hash(password, 5);
     
        const user = await User.create({ username, email, RoleID: RoleID, password: hashPassword });
        const lesson = await Lesson.create({ UserID: user.id, title: "some", content:"Text" });
    
        const token = generateJwt(user.id, user.username, user.email, user.RoleID)
        return res.json({ token });
    }

    async login(req, res, next) { 
        const { email, password } = req.body;
    
        
        let user = await User.findOne({ where: { email } });

       
        if (!user) {
            return next(ApiError.internal("Пользователя нет с таким email"));
        }
    
    
        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal("Неверный пароль"));
        }
    
      
        const token = generateJwt(user.id, user.username, user.email, user.RoleID);
    
      
        return res.json({ token });
    }

    async cheeck(req, res, next){

        const token = generateJwt(req.user.id ,req.user.email, req.user.RoleID)
        return res.json({token})
    }
}
export default new UserController(); 