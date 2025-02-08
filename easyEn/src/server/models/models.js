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
    img: { type: DataTypes.STRING, allowNull: true }, // Изображение пользователя необязательное
    RoleID: { type: DataTypes.INTEGER, allowNull: false } 
});

const Lesson = sequelize.define('Lesson', {
    LessonID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, 
    content: { type: DataTypes.TEXT, allowNull: true },
    img: { type: DataTypes.STRING, allowNull: true }, // 
});

const Progress = sequelize.define('Progress', {
    ProgressID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }, // По умолчанию прогресс не завершен
    UserID: { type: DataTypes.INTEGER, allowNull: false }, // Пользователь обязательный
    LessonID: { type: DataTypes.INTEGER, allowNull: false } //  обязательный
});

const Test = sequelize.define('Test', {
    TestID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, 
    createdBy: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true }, // Дата создания автоматически заполняется
    LessonID: { type: DataTypes.INTEGER, allowNull: false } 
});

const Question = sequelize.define('Question', {
    QuestionID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    QuestionText: { type: DataTypes.TEXT, allowNull: false }, 
    IsMultipleChoice: { type: DataTypes.BOOLEAN, defaultValue: false }, // По умолчанию вопрос не множественного выбора
    TestID: { type: DataTypes.INTEGER, allowNull: false } 
});

const Answer = sequelize.define('Answer', {
    AnswerID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    AnswerText: { type: DataTypes.TEXT, allowNull: false }, 
    IsCorrect: { type: DataTypes.BOOLEAN, defaultValue: false }, // По умолчанию ответ неправильный
    QuestionID: { type: DataTypes.INTEGER, allowNull: false } 
});

const TestResult = sequelize.define('TestResult', {
    ResultID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Score: { type: DataTypes.INTEGER, allowNull: false }, 
    CompletedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, 
    TestID: { type: DataTypes.INTEGER, allowNull: false }, 
    UserID: { type: DataTypes.INTEGER, allowNull: false } 
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


   

Role.hasMany(User, { foreignKey: 'RoleID' });
User.belongsTo(Role, { foreignKey: 'RoleID' });

User.hasMany(Progress, { foreignKey: 'UserID' });
Progress.belongsTo(User, { foreignKey: 'UserID' });

Lesson.hasMany(Progress, { foreignKey: 'LessonID' });
Progress.belongsTo(Lesson, { foreignKey: 'LessonID' });

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
    Progress,
    Test,
    TestResult,
    Question,
    Answer,
    Groups,
    StudentGroup,
    TeacherGroup
}

 