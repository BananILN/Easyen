'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'language', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'en',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'language');
  },
};