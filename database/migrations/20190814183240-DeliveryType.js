'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.addColumn(
      'Plates',
      'delivery_type',
      {
        type: Sequelize.ENUM('free', 'paid'),
        defaultValue: 'paid'
      }
    ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Plates', 'delivery_type')
    ]);
  }
};
