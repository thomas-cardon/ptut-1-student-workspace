const path = require('path');
const envPath = path.resolve(process.cwd(), '.env.local');

require('dotenv').config({ path: envPath });
console.dir(process.env);

const mysql = require('serverless-mysql');

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
  }
});

async function query(q) {
  try {
    const results = await db.query(q);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}

// Create "entries" table if doesn't exist
async function migrate() {
  try {
  await query(`
    CREATE TABLE USERS (
      id VARCHAR CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
      firstName VARCHAR CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
      lastName VARCHAR CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
      permissions TINYINT,
      PRIMARY KEY (id)
    );
  `);

    // Create "posts" table if doesn't exist
    await query(`
    CREATE TABLE POSTS (
      id INT unsigned NOT NULL AUTO_INCREMENT,
      title TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
      date DATETIME NOT NULL,
      content TEXT NOT NULL,
      PRIMARY KEY (id)
    )
  `);

    console.log('migration ran successfully');
  } catch (e) {
    console.error('could not run migration, double check your credentials.');
    process.exit(1);
  }
}

migrate().then(() => process.exit());
