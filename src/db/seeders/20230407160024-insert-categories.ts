'use strict';

import { date } from '../creation-update-date';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories_doctor', [
      { name: 'First category', ...date },
      { name: 'Second category', ...date },
      { name: 'Highest category', ...date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories_doctor', null, {});
  },
};
