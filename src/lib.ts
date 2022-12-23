import path from "path";
import sqlite from "sqlite3";
const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database("./sqlite.db");

// create tables with a field called value that can be incremented
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS value (value INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS date_started (date_started INTEGER)");
  db.run("INSERT INTO value (value) VALUES (0)");
});

export interface dateStartedInterface {
  date_started: number;
}

const setDateStarted = () => {
  console.log("docsl");
  const time = new Date().getTime();
  // Check if date started is already set
  db.get(
    "SELECT date_started FROM date_started",
    (err, row: dateStartedInterface) => {
      if (err) {
        return null;
      }

      if (row && row.date_started) {
        console.log("Didn't set date started");
        return;
      }

      db.run("INSERT INTO date_started (date_started) VALUES (?)", time);
    }
  );
};

const incrementValue = async () => {
  return new Promise((resolve, reject) => {
    return db.run("UPDATE value SET value = value + 1", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Incremented value");
    });
  });
};

const getValue = async () => {
  return new Promise((resolve, reject) => {
    return db.get("SELECT value FROM value", (err, row) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Got value", row.value);
      resolve(row.value);
    });
  });
};

// get date started from db with type validation
const _getDateStarted = async () => {
  return new Promise((resolve, reject) => {
    return db.get(
      "SELECT date_started FROM date_started",
      (err, row: dateStartedInterface) => {
        if (err) {
          console.error(err);
          return;
        }

        if (!row || !row.date_started) {
          return reject({ code: 101, message: "Date started not found" });
        }
        console.log("Got date started", row.date_started);
        resolve(row.date_started);
      }
    );
  });
};
const getDateStarted = async () => {
  try {
    const dateStarted = Number(await _getDateStarted());
    if (dateStarted) {
      return dateStarted;
    }
    setDateStarted();
    return Number(await _getDateStarted());
  } catch (err) {
    setDateStarted();
    return Number(await _getDateStarted());
  }
};

export { incrementValue, getValue, getDateStarted };
