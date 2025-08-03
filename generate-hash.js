// Script to generate the password hash for the default admin
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'C@me311001';
  const hash = await bcrypt.hash(password, 12);
  console.log('Password hash for C@me311001:', hash);
}

generateHash();
