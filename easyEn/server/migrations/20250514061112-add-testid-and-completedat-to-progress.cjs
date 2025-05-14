'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Progresses', 'TestID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Tests', 
        key: 'TestID',  
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', 
    });

    await queryInterface.addColumn('Progresses', 'CompletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Progresses', 'TestID');
    await queryInterface.removeColumn('Progresses', 'CompletedAt');
  },
};