import dbConnection from './dbConnection.js';

dbConnection();

const args = process.argv;
let limit = 10;

const fakerFile = args[2];
if (args[3]) {
  limit = parseInt(args[3]);
}

const faker = await import(`./faker/${fakerFile}.js`);

faker.run(limit);


