'use strict';

import { date } from '../creation-update-date';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('specialties', [
      { name: 'Obstetrician', ...date },
      { name: 'Obstetrician-gynecologist', ...date },
      { name: 'Allergist', ...date },
      { name: 'Andrologist', ...date },
      { name: 'Anesthesiologist-resuscitator', ...date },
      { name: 'Arrhythmologist', ...date },
      { name: 'Arthrologist', ...date },
      { name: 'Bacteriologist', ...date },
      { name: 'Venereologist', ...date },
      { name: 'Vertebrologist', ...date },
      { name: 'Sports medicine doctor (SMD)', ...date },
      {
        name: 'Complementary and alternative medicine doctor (CAMD)',
        ...date,
      },
      { name: 'Functional diagnostics doctor', ...date },
      { name: 'Emergency medicine doctor', ...date },
      { name: 'Cytologist', ...date },
      { name: 'Gastroenterologist', ...date },
      { name: 'Hematologist', ...date },
      { name: 'Geneticist', ...date },
      { name: 'Hepatologist', ...date },
      { name: 'Geriatrician', ...date },
      { name: 'Gynecologist', ...date },
      { name: 'Gynecologist-endocrinologist', ...date },
      { name: 'Hirudotherapist', ...date },
      { name: 'Gnathologist', ...date },
      { name: 'Dermatologist', ...date },
      { name: 'Defectologist', ...date },
      { name: 'Diabetologist', ...date },
      { name: 'Nutritionist', ...date },
      { name: 'Immunologist', ...date },
      { name: 'Infectionist', ...date },
      { name: 'Cardiologist', ...date },
      { name: 'Сardiac surgeon', ...date },
      { name: 'Coloproctologist', ...date },
      { name: 'Cosmetologist', ...date },
      { name: 'Laser surgeon', ...date },
      { name: 'Speech therapist', ...date },
      { name: 'Mammologist', ...date },
      { name: 'Chiropractor', ...date },
      { name: 'Masseur', ...date },
      { name: 'Mycologist', ...date },
      { name: 'Expert in narcology', ...date },
      { name: 'Neurologist', ...date },
      { name: 'Neurosurgeon', ...date },
      { name: 'Nephrologist', ...date },
      { name: 'Combustiologist', ...date },
      { name: 'Ophthalmologist', ...date },
      { name: 'Oncogynecologist', ...date },
      { name: 'Oncodermatologist', ...date },
      { name: 'Oncologist', ...date },
      { name: 'Oncourologist', ...date },
      { name: 'Orthopedist', ...date },
      { name: 'Otolaryngologist', ...date },
      { name: 'Otoneurologist', ...date },
      { name: 'Ophthalmic surgeon', ...date },
      { name: 'Pediatrician', ...date },
      { name: 'Plastic surgeon', ...date },
      { name: 'Proctologist', ...date },
      { name: 'Psychiatrist', ...date },
      { name: 'Psychologist', ...date },
      { name: 'Psychotherapist', ...date },
      { name: 'Pulmonologist', ...date },
      { name: 'Radiologist', ...date },
      { name: 'Rehabilitologist', ...date },
      { name: 'Rheumatologist', ...date },
      { name: 'Reproductologist', ...date },
      { name: 'Sexologist', ...date },
      { name: 'Family doctor', ...date },
      { name: 'Vascular surgeon', ...date },
      { name: 'Dentist', ...date },
      { name: 'Dentist-implantologist', ...date },
      { name: 'Dentist-orthodontist', ...date },
      { name: 'Dentist-orthopedist', ...date },
      { name: 'Periodontist', ...date },
      { name: 'Dentist-therapist', ...date },
      { name: 'Dentist-surgeon', ...date },
      { name: 'Therapist', ...date },
      { name: 'Thoracic surgeon', ...date },
      { name: 'Traumatologist', ...date },
      { name: 'Transplantologist', ...date },
      { name: 'Ultrasound specialist', ...date },
      { name: 'Urologist', ...date },
      { name: 'Physiatrist', ...date },
      { name: 'Physiotherapist', ...date },
      { name: 'Phoniatrician', ...date },
      { name: 'Phlebologist', ...date },
      { name: 'Surgeon', ...date },
      { name: 'Maxillofacial Surgeon', ...date },
      { name: 'Embryologist', ...date },
      { name: 'Endocrinologist', ...date },
      { name: 'Endoscopist', ...date },
      { name: 'Epileptologist', ...date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('specialties', null, {});
  },
};