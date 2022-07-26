const secrets = {
  dbUri: process.env.DB_URI || 'mongodb+srv://admin:123@cluster0-0adls.mongodb.net/events',
};


const config = {
  REACT_APP_URL:`http://localhost:3000`
};

const getSecret = (key) => secrets[key];

module.exports = { getSecret, config };
