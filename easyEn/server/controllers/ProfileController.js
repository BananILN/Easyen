import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {User} = models

class ProfileController{
      async getAll(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return next(ApiError.unauthorized("Требуется авторизация"));
            }
            const decoded = jwtDecode(token);
            const user = await User.findByPk(decoded.UserID);
            if (!user || user.RoleID !== 2) {
                return next(ApiError.forbidden("Доступ запрещён: требуется роль администратора"));
            }
            const users = await User.findAll();
            return res.json(users);
        } catch (e) {
            return next(ApiError.internal(`Ошибка сервера: ${e.message}`));
        }
    }

        async getOne(req,res,next){
            const { id } =req.params;
            const user = await User.findByPk(id)

            if(!user){
                return next(ApiError.badRequest("Not found"))
            }
            return res.json(user)
        }
        
        async update(req, res, next) {
          try {
            const { id } = req.params;
            const { username, email } = req.body;
      
            console.log("Полученные данные:", { id, username, email, files: req.files });
      
            const user = await User.findByPk(id);
            if (!user) {
              return next(ApiError.badRequest("Пользователь не найден"));
            }
      
            let fileName = user.img;
            if (req.files && req.files.img) {
              const file = req.files.img;
              fileName = `${uuidv4()}-${file.name}`;
              const filePath = path.resolve(__dirname, '..', 'static', fileName);
              console.log("Сохраняем файл в:", filePath);
              await file.mv(filePath);
              console.log("Сохранённый файл:", fileName);
            } else {
              console.log("Файл не загружен");
            }
      
            const updatedData = {
              username: username || user.username,
              email: email || user.email,
              img: fileName,
            };
      
            console.log("Данные для обновления:", updatedData);
            await user.update(updatedData);
            console.log("Обновлённый пользователь:", user.toJSON());
            return res.json(user);
          } catch (e) {
            console.error("Ошибка в update:", e);
            return next(ApiError.internal(`Ошибка сервера: ${e.message}`));
          }
        }
        
}

export default new ProfileController()