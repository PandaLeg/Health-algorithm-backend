'use strict';

import { date } from '../creation-update-date';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      { name: 'ADMIN', ...date },
      { name: 'PATIENT', ...date },
      { name: 'DOCTOR', ...date },
      { name: 'CLINIC', ...date },
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
