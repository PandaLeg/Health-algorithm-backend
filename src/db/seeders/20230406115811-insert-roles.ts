'use strict';

const dates = {
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      { name: 'ADMIN', ...dates },
      { name: 'PATIENT', ...dates },
      { name: 'DOCTOR', ...dates },
      { name: 'CLINIC', ...dates },
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
