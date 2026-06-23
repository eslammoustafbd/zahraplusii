'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const usersFile = path.join(root, 'data', 'users.json');
const email = 'admin@zahratelrabea.com';
const password = 'Zahrat2026Admin';
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.scryptSync(password, salt, 64).toString('hex');
const users = [{
  id: 'admin-1',
  name: 'Eslam Moustafa',
  email,
  role: 'super_admin',
  active: true,
  mustChangePassword: false,
  salt,
  passwordHash: hash,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}];
fs.mkdirSync(path.dirname(usersFile), { recursive: true });
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
console.log('Admin account reset successfully.');
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
