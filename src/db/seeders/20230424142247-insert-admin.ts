'use strict';

import { date } from '../creation-update-date';
import hashPassword from '../../utils/hashPassword';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await hashPassword('gostKurt');

    await queryInterface.bulkInsert('users', [
      {
        id: '72f131ce-cd6a-4263-bffb-462470ae93a1',
        phone: '+380669182530',
        password: hashedPassword,
        email: 'kurtlansfer@gmail.com',
        activationCode: null,
        isActivated: false,
        ...date,
      },
    ]);

    const userId = await queryInterface.rawSelect(
      'users',
      {
        where: {
          phone: '+380669182530',
        },
      },
      ['id'],
    );

    await queryInterface.bulkInsert('user_roles', [
      {
        userId,
        roleId: 1,
      },
    ]);

    return Promise.resolve();
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
