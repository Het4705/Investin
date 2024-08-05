const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Investor = require('../models/investors.model');

const generateFakeInvestor = () => ({
  admin_id: new mongoose.Types.ObjectId(),
  companyName: faker.company.name(),
  companyGovtVerifiedNo: faker.finance.account(),
  logo: faker.image.imageUrl(),
  keyPeople: Array.from({ length: 3 }, () => ({
    name: faker.name.fullName(),
    position: faker.name.jobTitle(),
    info: faker.lorem.sentence(),
    image: faker.image.avatar(),
  })),
  companiesInvested: Array.from({ length: 3 }, () => ({
    cname: faker.company.name(),
    clogo: [faker.image.imageUrl()],
    info: faker.lorem.sentence(),
    holdingShare: faker.datatype.number({ min: 1, max: 100 }),
  })),
  briefInfo: faker.lorem.paragraph(),
  images: Array.from({ length: 3 }, () => faker.image.imageUrl()),
  contact: faker.phone.number(),
  email: faker.internet.email(),
  address: {
    city: faker.address.city(),
    state: faker.address.state(),
    country: faker.address.country(),
    pincode: faker.address.zipCode(),
  },
  likes: faker.datatype.number({ min: 0, max: 100 }),
});

const fakeInvestors = async (num = 10) => {
  const investors = Array.from({ length: num }, generateFakeInvestor);
  try {
    await Investor.insertMany(investors);
    console.log('Fake data inserted successfully');
  } catch (err) {
    console.error('Error inserting fake data:', err);
  }
};

module.exports = fakeInvestors;
