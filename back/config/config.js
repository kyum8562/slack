require('dotenv').config();

console.log('MYSQL_PASSWORD', process.env.MYSQL_PASSWORD);

module.exports = {
  "development": {
    "username": "root",
    "password": 'rlfls1927@@',
    "database": "sleact",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": 'rlfls1927@@',
    "database": "sleact",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": 'rlfls1927@@',
    "database": "sleact",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
