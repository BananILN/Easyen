import { sequelize } from "../db"
import { DataTypes } from "sequelize"

const Role = sequelize.define('Role', {
    RoleID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    RoleName: { type: DataTypes.STRING, unique: true, allowNull: false } // Название роли должно быть уникальным и обязательным
});

const User = sequelize.define('User', {
    UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false }, // Имя пользователя уникальное и обязательное
    email: { type: DataTypes.STRING, unique: true, allowNull: false }, // Email уникальный и обязательный
    password: { type: DataTypes.STRING, allowNull: false }, // Пароль обязательный
    img: { type: DataTypes.STRING, allowNull: true }, // Изображение пользователя (необязательное)
    createdBy: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Дата создания (автоматически заполняется)
    RoleID: { type: DataTypes.INTEGER, allowNull: false } // Роль обязательная
});

const Lesson = sequelize.define('Lesson', {
    LessonID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, // Название урока обязательное
    content: { type: DataTypes.TEXT, allowNull: true } // Содержание урока (необязательное)
});

const Progress = sequelize.define('Progress', {
    ProgressID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }, // По умолчанию прогресс не завершен
    UserID: { type: DataTypes.INTEGER, allowNull: false }, // Пользователь обязательный
    LessonID: { type: DataTypes.INTEGER, allowNull: false } // Урок обязательный
});

const Test = sequelize.define('Test', {
    TestID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, // Название теста обязательное
    createdBy: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Дата создания (автоматически заполняется)
    LessonID: { type: DataTypes.INTEGER, allowNull: false } // Урок обязательный
});

const Question = sequelize.define('Question', {
    QuestionID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    QuestionText: { type: DataTypes.TEXT, allowNull: false }, // Текст вопроса обязательный
    IsMultipleChoice: { type: DataTypes.BOOLEAN, defaultValue: false }, // По умолчанию вопрос не множественного выбора
    TestID: { type: DataTypes.INTEGER, allowNull: false } // Тест обязательный
});

const Answer = sequelize.define('Answer', {
    AnswerID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    AnswerText: { type: DataTypes.TEXT, allowNull: false }, // Текст ответа обязательный
    IsCorrect: { type: DataTypes.BOOLEAN, defaultValue: false }, // По умолчанию ответ неправильный
    QuestionID: { type: DataTypes.INTEGER, allowNull: false } // Вопрос обязательный
});

const TestResult = sequelize.define('TestResult', {
    ResultID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Score: { type: DataTypes.INTEGER, allowNull: false }, // Оценка обязательная
    CompletedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Дата завершения (автоматически заполняется)
    TestID: { type: DataTypes.INTEGER, allowNull: false }, // Тест обязательный
    UserID: { type: DataTypes.INTEGER, allowNull: false } // Пользователь обязательный
});

const Groups = sequelize.define('Groups', {
    GroupID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    GroupName: { type: DataTypes.STRING, unique: true, allowNull: false } // Название группы уникальное и обязательное
});

const StudentGroup = sequelize.define('StudentGroup', {
    StudentID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Уникальный ID для связи
    GroupID: { type: DataTypes.INTEGER, allowNull: false } // Группа обязательная
});

const TeacherGroup = sequelize.define('TeacherGroup', {
    TeacherID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Уникальный ID для связи
    GroupID: { type: DataTypes.INTEGER, allowNull: false } // Группа обязательная
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