import dbConnection from '../dbConnection.js';
import { faker } from '@faker-js/faker';
import Answer from '../models/Answer.js';

dbConnection();

let data = [];

for (let i = 0; i < 100; i++) {
  data.push({
    '64a703cee0aac1eed2be050d': faker.person.fullName(),
    '64a5c6d57ddf615be1fa0a1b': faker.helpers.arrayElement(['38', '39', '40']),
    '64a5af163c53e2799f67dc03': faker.internet.email(),
    formId: '64a59d11e1de0d0d8eeaa8a5',
    userId: '64a59917e1de0d0d8eeaa898',
  });
}

Answer.insertMany(data);
