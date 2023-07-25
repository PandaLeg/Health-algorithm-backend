'use strict';

import { date } from '../creation-update-date';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('week_days', [
      { name: 'Monday', ...date },
      { name: 'Tuesday', ...date },
      { name: 'Wednesday', ...date },
      { name: 'Thursday', ...date },
      { name: 'Friday', ...date },
      { name: 'Saturday', ...date },
      { name: 'Sunday', ...date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('week_days', null, {});
  },
};
