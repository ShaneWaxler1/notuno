const bcrypt = require("bcrypt");
const { result } = require("../connection");

const db = require("../connection");

const CREATE_SQL =
  "INSERT INTO users (displayname, email, passwd) VALUES ($1, $2, $3) RETURNING *";

const create = async (displayname, email, password) => {
  // console.log("hashing password");
  const hash = await bcrypt.hash(password, 10);
  // console.log("hashed", hash);
  try {
    return db.one(CREATE_SQL, [
      displayname.toString().toLowerCase(),
      email.toString().toLowerCase(),
      hash,
    ]);
  } catch (err) {
    console.error(err);
  }
};

const FIND_BY_ID_SQL = "SELECT * FROM users WHERE id=$1";
const findById = (id) => {
  try {
    return db.one(FIND_BY_ID_SQL, [id]);
  } catch (err) {
    console.error(err);
  }
};

const FIND_BY_EMAIL_SQL = "SELECT * FROM users WHERE email=$1";
const findByEmail = (email) => {
  try {
    return db.any(FIND_BY_EMAIL_SQL, [email.toString().toLowerCase()]);
  } catch (err) {
    console.error(err);
  }
};

const FIND_BY_DISPLAYNAME = `SELECT * FROM users WHERE displayname=$1`;
const findByDisplayname = (displayname) => {
  try {
    return db.any(FIND_BY_DISPLAYNAME, [displayname.toString().toLowerCase()]);
  } catch (err) {
    console.error(err);
  }
};

const findUser = async (email, displayname) => {
  const FIND_BY_EMAIL_SQL_NULL =
    "SELECT (SELECT email FROM users WHERE email=$1) AS email";
  const FIND_BY_DISPLAYNAME_SQL_NULL =
    "SELECT (SELECT displayname FROM users WHERE displayname=$1) AS username";
  try {
    const dbEmail = await db.any(FIND_BY_EMAIL_SQL_NULL, [
      email.toString().toLowerCase(),
    ]);
    const dbUsername = await db.any(FIND_BY_DISPLAYNAME_SQL_NULL, [
      displayname.toString().toLowerCase(),
    ]);
    // console.log("findUser", dbEmail, dbUsername);
    if (dbEmail[0].email === null && dbUsername[0].username === null) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  create,
  findById,
  findByEmail,
  findByDisplayname,
  findUser,
};
