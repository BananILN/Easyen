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

    async getAll(req, res){
        const lessons = await Lesson.findAll()
        return res.json(lessons)
    }

    async getOne(req,res,next){
        const {id} = req.params;
        const lesson = await Lesson.findByPk(id);

        if(!lesson){
            return next(ApiError.badRequest("not found"))
        }
        return res.json(lesson)
    }
    

}
export default new LessonController();


