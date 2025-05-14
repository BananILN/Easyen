'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserAnswers', {
      UserAnswerID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'UserID' },
      },
      QuestionID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Questions', key: 'QuestionID' },
      },
      AnswerID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Answers', key: 'AnswerID' },
      },
      TestID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tests', key: 'TestID' },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('UserAnswers');
  },
};