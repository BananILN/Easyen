import ApiError from "../Error/ApiErrors.js";
import bcrypt from 'bcrypt'
import { models } from '../models/models.js';
import jwt from 'jsonwebtoken'
import { getVerificationCode, removeVerificationCode, storeVerificationCode } from "../utils/verificationStore.js";
import { sendVerificationEmail } from "../utils/EmailService.js";


const {User, Lesson} = models;

const generateJwt =  (UserID, username, email, RoleID) =>{
    return jwt.sign({ UserID, username, email, RoleID }, process.env.SECRET_KEY,
         { expiresIn: '24h' }
        );
}

const generateTempJwt = (username, email, hashPassword, RoleID) =>{
  return jwt.sign({username, email, hashPassword, RoleID}, process.env.SECRET_KEY, {expiresIn: '10m'});
}

const generateVerificationCode = () =>{
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class UserController {
        async registration(req, res, next) {
          const { username, email, password, RoleID = 1 } = req.body;

          if (!email || !password || !username) {
            return next(ApiError.badRequest("Email, password, and username are required"));
          }

          try {
            const emailCandidate = await User.findOne({ where: { email } });
            if (emailCandidate) {
              return next(ApiError.badRequest("This email is already in use"));
            }

            const usernameCandidate = await User.findOne({ where: { username } });
            if (usernameCandidate) {
              return next(ApiError.badRequest("This username is already in use"));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const tempToken = generateTempJwt(username, email, hashPassword, RoleID);

            const verificationCode = generateVerificationCode();
            const expiresAt = Date.now() + 10 * 60 * 1000;

            storeVerificationCode(tempToken, verificationCode, expiresAt);

            await sendVerificationEmail(email, verificationCode);
            return res.json({ tempToken, message: "Код подтверждения отправлен на ваш email" });
          } catch (e) {
            return next(ApiError.internal("Ошибка при регистрации: " + e.message));
          }
        }
  
       async verifyEmail(req, res, next) {
          const { tempToken, code } = req.body;
      
          try {
            const storedData = getVerificationCode(tempToken);
            if (!storedData) {
              return next(ApiError.badRequest("Код не найден или истёк"));
            }
            if (Date.now() > storedData.expiresAt) {
              removeVerificationCode(tempToken);
              return next(ApiError.badRequest("Срок действия кода истёк"));
            }
            if (code !== storedData.code) {
              return next(ApiError.badRequest("Неверный код подтверждения"));
            }
      
            const decoded = jwt.verify(tempToken, process.env.SECRET_KEY);
            const { username, email, hashPassword, RoleID } = decoded;
      
            const user = await User.create({
              username,
              email,
              RoleID: RoleID,
              password: hashPassword,
            });
      
            if (!user.UserID) {
              return next(ApiError.internal("Ошибка при создании пользователя: UserID не найден"));
            }
      
            removeVerificationCode(tempToken);
      
            const token = generateJwt(user.UserID, user.username, user.email, user.RoleID);
            return res.json({ token, message: "Email успешно подтверждён" });
          } catch (error) {
            return next(ApiError.internal("Ошибка подтверждения: " + error.message));
          }
        }

    async resendCode(req, res, next) {
      const { tempToken } = req.body;

      try {
        const storedData = getVerificationCode(tempToken);
        if (!storedData) {
          return next(ApiError.badRequest("Код не найден или истёк"));
        }

        const decoded = jwt.verify(tempToken, process.env.SECRET_KEY);
        const { email } = decoded;

        const verificationCode = generateVerificationCode();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        storeVerificationCode(tempToken, verificationCode, expiresAt);

        await sendVerificationEmail(email, verificationCode);
        return res.json({ message: "Код отправлен повторно" });
      } catch (error) {
        return next(ApiError.internal("Ошибка повторной отправки: " + error.message));
      }
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
      try {
        if (!req.user || !req.user.UserID) {
          return res.status(401).json({ message: "Не авторизован" });
        }
    
      
        const token = generateJwt(req.user.UserID, req.user.username, req.user.email, req.user.RoleID);
        return res.json({ token });
      } catch (e) {
        next(ApiError.internal(e.message));
      }
    }
}
export default new UserController(); 