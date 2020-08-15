const fs = require('fs');

const res = {};

if (process.env.SSL_KEY && process.env.SSL_CRT) {
  console.log('Start with ssl');
  const sslKey = process.env.SSL_KEY;
  const sslCert = process.env.SSL_CRT;
  res.ssl = {
    key: fs.readFileSync(sslKey),
    cert: fs.readFileSync(sslCert),
  };
} else {
  console.log('Start without ssl');
}

res.port = 1339;

module.exports = res;
