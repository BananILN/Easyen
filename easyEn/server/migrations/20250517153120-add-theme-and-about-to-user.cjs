'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'theme', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'blue'
    });

    await queryInterface.addColumn('Users', 'about', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'about');
    await queryInterface.removeColumn('Users', 'theme');
  }
};