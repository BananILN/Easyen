'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tests', 'testType', {
      type: Sequelize.ENUM('regular', 'classic', 'trueFalse'),
      allowNull: false,
      defaultValue: 'regular'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tests', 'testType');
  }
};