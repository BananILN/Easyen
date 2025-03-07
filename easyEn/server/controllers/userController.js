import ApiError from "../Error/ApiErrors.js";
import bcrypt from 'bcrypt'
import { models } from '../models/models.js';
import jwt from 'jsonwebtoken'


const {User, Lesson} = models;

const generateJwt =  (UserID, username, email, RoleID) =>{
    return jwt.sign({ UserID, username, email, RoleID }, process.env.SECRET_KEY,
         { expiresIn: '24h' }
        );
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
        console.log("Созданный пользователь:", user); // Проверьте, что user содержит UserID
      
        if (!user.UserID) {
          return next(ApiError.internal("Ошибка при создании пользователя: UserID не найден"));
        }
      
        const token = generateJwt(user.UserID, user.username, user.email, user.RoleID);
        console.log("Декодированный токен:", jwt.decode(token)); // Проверьте содержимое токена
      
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
      
        const token = generateJwt(user.UserID, user.username, user.email, user.RoleID);
        return res.json({ token });
      }

    async cheeck(req, res, next){

        const token = generateJwt(req.user.UserID ,req.user.email, req.user.RoleID)
        return res.json({token})
    }
}
export default new UserController(); 