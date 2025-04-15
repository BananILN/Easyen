import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { Question } = models;

class QuestionController{
    async create(req,res,next){
        try{
            const {questionText, isMultipleChoice, testID} = req.body;
            const question = await Question.create({ QuestionText: questionText,  IsMultipleChoice: isMultipleChoice,  TestID: testID});
            return res.json(question)
        } catch(e){
            next(ApiError.badRequest(e.message));
        }
        
    }

    async getAll(req, res) {
        const { TestID } = req.query;
        const questions = await Question.findAll({
          where: TestID ? { TestID } : {},
        });
        return res.json(questions);
      }

    async getOne(req, res ,next){
        const { id } = req.params;
        const question = await Question.findByPk(id)

        if(!question){
            return next(ApiError.badRequest("Not found"))
        }
        return res.json(question)
    }
}
export default new QuestionController();




