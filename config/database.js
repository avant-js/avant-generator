let dbname = mydb;
let url = `mongodb://localhost/${dbname}`;

// Use a local test database for integration tests
if (process.env.NODE_ENV === 'test')
  url += '-test';

module.exports = {
  url: url
}