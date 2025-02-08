import { models } from '../models/models.js'
import ApiError from '../Error/ApiErrors.js';

const { Test } = models;

class TestController{
    async create(req, res,next){
        try {
            const {title, LessonID} = req.body
            const testTitle = await Test.create({title,LessonID})
            return res.json(testTitle)

        } catch (e){
            return next(ApiError.badRequest(e.message))
        }
       
    }

    async getAll(req,res){
        const test = await Test.findAll()
        return res.json(test)
    }
    
    async getOne(req, res, next){
        const {id} = req.params;
        const test = await Test.findByPk(id)
        if(!test){
            return next(ApiError.badRequest("not found"))
        }
        return res.json(test)

    }

}
export default new TestController();


