'use strict';


module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Lessons', 'sections', {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: []
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Lessons', 'sections');
    }
};