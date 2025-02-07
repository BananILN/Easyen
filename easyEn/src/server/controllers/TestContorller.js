import { models } from '../models/models.js'
import ApiError from '../Error/ApiErrors.js';

const { Test } = models;

class TestController{
    async create(req, res){
        const {title} = req.body
        const testTitle = await Test.create({title})
        return res.json(testTitle)
    }

    async getAll(req,res){
        const test = await Test.findAll()
        return res.json(test)
    }
}
export default new TestController();


