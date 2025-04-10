import { models } from '../models/models.js'
import ApiError from '../Error/ApiErrors.js';
import { v4 as uuidv4 } from 'uuid'; 
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Lesson } = models;

class LessonController{
    async create(req, res,next){
        try{
            const {title, content} = req.body;
            let fileName = null; 

            if (req.files && req.files.img) {
                const { img } = req.files;
                fileName = uuidv4() + ".png";
                await img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }
            const lesson =  await Lesson.create({title,content, img: fileName})
            return res.json(lesson) 
        } catch (e){
            next(ApiError.badRequest(e.message))
        }

    }
    async delete(req, res, next) {
        try {
          const { id } = req.params;
          const lesson = await Lesson.findByPk(id);
          
          if (!lesson) {
            return res.status(404).json({ message: "Урок не найден" });
          }
    
          await lesson.destroy();
          return res.json({ message: "Урок успешно удален" });
        } catch (e) {
          next(ApiError.badRequest(e.message));
        }
      }

    async update(req,res,next){
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            let fileName = null;
      
            const lesson = await Lesson.findByPk(id);
            if (!lesson) {
              return res.status(404).json({ message: "Урок не найден" });
            }
      
            if (req.files && req.files.img) {
              const { img } = req.files;
              fileName = uuidv4() + ".png";
              await img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }
      
            // Обновляем только те поля, которые переданы
            await lesson.update({
              title: title || lesson.title,
              content: content || lesson.content,
              img: fileName || lesson.img,
            });
      
            return res.json(lesson);
          } catch (e) {
            next(ApiError.badRequest(e.message));
          }
    }

    async getAll(req, res){
        const lessons = await Lesson.findAll()
        return res.json(lessons)
    }

    async getOne(req,res,next){
        try {
            const {id} = req.params;
            const lesson = await Lesson.findByPk(id);
            
            if(!lesson) {
                return res.status(404).json({message: "Урок не найден"});
            }
            
            res.set('Content-Type', 'application/json');
            return res.json(lesson);
        } catch (e) {
            console.error(e);
            return res.status(500).json({message: "Ошибка сервера"});
        }
    }
    

}
export default new LessonController();


