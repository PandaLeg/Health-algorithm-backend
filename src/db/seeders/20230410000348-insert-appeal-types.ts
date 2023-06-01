'use strict';

import { date } from '../creation-update-date';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('appeal_types', [
      { name: 'CHECK', ...date },
      { name: 'SUBSCRIBE', ...date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('appeal_types', null, {});
  },
};
