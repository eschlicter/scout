'use strict';

const faker = require("faker");

 let users = [
   {
    id: -1,
    name: "John",
    email: "john@test.com",
    password: "123456",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
   },
   {
    id: -2,
    name: "Paul",
    email: "paul@test.com",
    password: "abcdef",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "premium"
   },
   {
    id: -3,
    name: "George",
    email: "george@test.com",
    password: "654321",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "admin"
   }
 ];


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
