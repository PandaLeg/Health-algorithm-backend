'use strict';

import { date } from '../creation-update-date';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('clinic_types', [
      { name: 'Clinic', ...date },
      { name: 'Polyclinic', ...date },
      { name: 'Ambulatory', ...date },
      { name: 'Medical Center', ...date },
      { name: 'Institute', ...date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('clinic_types', null, {});
  },
};
