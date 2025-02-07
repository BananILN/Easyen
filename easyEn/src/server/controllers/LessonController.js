import { models } from '../models/models.js'
import ApiError from '../Error/ApiErrors.js';

const { Lesson } = models;

class LessonController{
    async create(req, res){
        const {title, content} = req.body;
        const {img} = req.files;
        const lesson =  await Lesson.create({title,content})
        return res.json(lesson)
    }

    async getAll(req, res){
        const lessons = await Lesson.findAll()
        return res.json(lessons)
    }

    async getOne(){

    }
    

}
export default new LessonController();


