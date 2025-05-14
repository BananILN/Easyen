import { sequelize } from "../db.js";
import { DataTypes } from "sequelize"

const Role = sequelize.define('Role', {
    RoleID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    RoleName: { type: DataTypes.STRING, unique: true, allowNull: false } 
});

const User = sequelize.define('User', {
    UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false }, 
    email: { type: DataTypes.STRING, unique: true, allowNull: false }, 
    password: { type: DataTypes.STRING, allowNull: false }, 
    img: { type: DataTypes.STRING, allowNull: true }, 
    RoleID: { type: DataTypes.INTEGER, allowNull: false } 
});

const Lesson = sequelize.define('Lesson', {
    LessonID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, 
    content: { type: DataTypes.TEXT, allowNull: true },
    img: { type: DataTypes.STRING, allowNull: true }, 
    sections: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }
});

const Progresses = sequelize.define('Progresses', {
    ProgressID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }, 
    UserID: { type: DataTypes.INTEGER, allowNull: false }, 
    LessonID: { type: DataTypes.INTEGER, allowNull: false },
    TestID: { type: DataTypes.INTEGER, allowNull: true }, 
    CompletedAt: { type: DataTypes.DATE, allowNull: true }
});



const Test = sequelize.define('Test', {
    TestID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, 
    createdBy: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true }, 
    LessonID: { type: DataTypes.INTEGER, allowNull: false } ,
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

const Question = sequelize.define('Question', {
    QuestionID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    QuestionText: { type: DataTypes.TEXT, allowNull: false }, 
    IsMultipleChoice: { type: DataTypes.BOOLEAN, defaultValue: false }, 
    TestID: { type: DataTypes.INTEGER, allowNull: false } 
});

const Answer = sequelize.define('Answer', {
    AnswerID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    AnswerText: { type: DataTypes.TEXT, allowNull: false }, 
    IsCorrect: { type: DataTypes.BOOLEAN, defaultValue: false }, 
    QuestionID: { type: DataTypes.INTEGER, allowNull: false } 
});

const TestResult = sequelize.define('TestResult', {
    ResultID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Score: { type: DataTypes.INTEGER, allowNull: false }, 
    CompletedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, 
    TestID: { type: DataTypes.INTEGER, allowNull: false }, 
    UserID: { type: DataTypes.INTEGER, allowNull: false },
    timeTaken: { type: DataTypes.INTEGER, allowNull: true }
});

const Groups = sequelize.define('Groups', {
    GroupID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    GroupName: { type: DataTypes.STRING, unique: true, allowNull: false } 
});

const StudentGroup = sequelize.define('StudentGroup', {
    StudentID: { type: DataTypes.INTEGER, allowNull: false }, 
    GroupID: { type: DataTypes.INTEGER, allowNull: false } 
}, {
    timestamps: false, 
    primaryKey: false 
});

const TeacherGroup = sequelize.define('TeacherGroup', {
    TeacherID: { type: DataTypes.INTEGER, allowNull: false }, 
    GroupID: { type: DataTypes.INTEGER, allowNull: false } 
}, {
    timestamps: false, 
    primaryKey: false 
});

const UserAnswer = sequelize.define('UserAnswer', {
  UserAnswerID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserID: { type: DataTypes.INTEGER, allowNull: false },
  QuestionID: { type: DataTypes.INTEGER, allowNull: false },
  AnswerID: { type: DataTypes.INTEGER, allowNull: false },
  TestID: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasMany(UserAnswer, { foreignKey: 'UserID' });
UserAnswer.belongsTo(User, { foreignKey: 'UserID' });

Question.hasMany(UserAnswer, { foreignKey: 'QuestionID' });
UserAnswer.belongsTo(Question, { foreignKey: 'QuestionID' });

Answer.hasMany(UserAnswer, { foreignKey: 'AnswerID' });
UserAnswer.belongsTo(Answer, { foreignKey: 'AnswerID' });

Test.hasMany(UserAnswer, { foreignKey: 'TestID' });
UserAnswer.belongsTo(Test, { foreignKey: 'TestID' });


Role.hasMany(User, { foreignKey: 'RoleID' });
User.belongsTo(Role, { foreignKey: 'RoleID' });

User.hasMany(Progresses, { foreignKey: 'UserID' });
Progresses.belongsTo(User, { foreignKey: 'UserID' });

Lesson.hasMany(Progresses, { foreignKey: 'LessonID' });
Progresses.belongsTo(Lesson, { foreignKey: 'LessonID' });

Lesson.hasMany(Test, { foreignKey: 'LessonID' });
Test.belongsTo(Lesson, { foreignKey: 'LessonID' });

Test.hasMany(Question, { foreignKey: 'TestID' });
Question.belongsTo(Test, { foreignKey: 'TestID' });

Question.hasMany(Answer, { foreignKey: 'QuestionID' });
Answer.belongsTo(Question, { foreignKey: 'QuestionID' });

Test.hasMany(TestResult, { foreignKey: 'TestID' });
TestResult.belongsTo(Test, { foreignKey: 'TestID' });

User.hasMany(TestResult, { foreignKey: 'UserID' });
TestResult.belongsTo(User, { foreignKey: 'UserID' });

User.belongsToMany(Groups, { through: 'StudentGroup', foreignKey: 'StudentID' });
Groups.belongsToMany(User, { through: 'StudentGroup', foreignKey: 'GroupID' });

User.belongsToMany(Groups, { through: 'TeacherGroup', foreignKey: 'TeacherID' });
Groups.belongsToMany(User, { through: 'TeacherGroup', foreignKey: 'GroupID' });

Groups.hasMany(StudentGroup, { foreignKey: 'GroupID' });
StudentGroup.belongsTo(Groups, { foreignKey: 'GroupID' });

Groups.hasMany(TeacherGroup, { foreignKey: 'GroupID' });
TeacherGroup.belongsTo(Groups, { foreignKey: 'GroupID' });

User.hasMany(StudentGroup, { foreignKey: 'StudentID' });
StudentGroup.belongsTo(User, { foreignKey: 'StudentID' });

User.hasMany(TeacherGroup, { foreignKey: 'TeacherID' });
TeacherGroup.belongsTo(User, { foreignKey: 'TeacherID' });

 export const models = {
    User,
    Role,
    Lesson,
    Progresses,
    Test,
    TestResult,
    Question,
    Answer,
    Groups,
    StudentGroup,
    TeacherGroup,
    UserAnswer
}

 