"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateStarted = exports.getValue = exports.incrementValue = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite3 = sqlite3_1.default.verbose();
const db = new sqlite3.Database("./sqlite.db");
// create tables with a field called value that can be incremented
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS value (value INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS date_started (date_started INTEGER)");
    db.run("INSERT INTO value (value) VALUES (0)");
});
const setDateStarted = () => {
    console.log("docsl");
    const time = new Date().getTime();
    // Check if date started is already set
    db.get("SELECT date_started FROM date_started", (err, row) => {
        if (err) {
            return null;
        }
        if (row && row.date_started) {
            console.log("Didn't set date started");
            return;
        }
        db.run("INSERT INTO date_started (date_started) VALUES (?)", time);
    });
};
const incrementValue = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        return db.run("UPDATE value SET value = value + 1", (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Incremented value");
        });
    });
});
exports.incrementValue = incrementValue;
const getValue = () => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.getValue = getValue;
// get date started from db with type validation
const _getDateStarted = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        return db.get("SELECT date_started FROM date_started", (err, row) => {
            if (err) {
                console.error(err);
                return;
            }
            if (!row || !row.date_started) {
                return reject({ code: 101, message: "Date started not found" });
            }
            console.log("Got date started", row.date_started);
            resolve(row.date_started);
        });
    });
});
const getDateStarted = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dateStarted = Number(yield _getDateStarted());
        if (dateStarted) {
            return dateStarted;
        }
        setDateStarted();
        return Number(yield _getDateStarted());
    }
    catch (err) {
        setDateStarted();
        return Number(yield _getDateStarted());
    }
});
exports.getDateStarted = getDateStarted;
//# sourceMappingURL=lib.js.map