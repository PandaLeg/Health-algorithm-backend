'use strict';

import { date } from '../creation-update-date';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('week_days', [
      { id: 1, name: 'Monday', ...date },
      { id: 2, name: 'Tuesday', ...date },
      { id: 3, name: 'Wednesday', ...date },
      { id: 4, name: 'Thursday', ...date },
      { id: 5, name: 'Friday', ...date },
      { id: 6, name: 'Saturday', ...date },
      { id: 0, name: 'Sunday', ...date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('week_days', null, {});
  },
};
