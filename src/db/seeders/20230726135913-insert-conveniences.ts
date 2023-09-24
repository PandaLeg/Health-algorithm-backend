'use strict';

import { date } from '../creation-update-date';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('conveniences', [
      { name: 'Wi-Fi', ...date },
      { name: `Children's room`, ...date },
      { name: 'Card payment', ...date },
      { name: 'Parking', ...date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('conveniences', null, {});
  },
};
