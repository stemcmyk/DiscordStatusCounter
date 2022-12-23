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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const lib_1 = require("./lib");
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const dateToRelativeTime = (date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    let text = "";
    if (interval > 1) {
        text += `${interval}y `;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        text += `${interval}mo `;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        text += `${interval}d `;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        text += `${interval}h `;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        text += `${interval}m `;
    }
    text += `${Math.floor(seconds % 60)}s`;
    return text;
};
const sendOfflineNotice = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sendOfflineNotice");
    try {
        const response = yield (0, node_fetch_commonjs_1.default)("https://discord.com/api/v8/users/@me/settings", {
            method: "PATCH",
            headers: {
                Authorization: `${DISCORD_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                custom_status: {
                    text: `Count is currently offline`,
                },
            }),
        });
        if (response.status !== 200) {
            console.error("Failed to update discord status", yield response.text());
            return;
        }
        console.log(`Updated discord status to offline`);
    }
    catch (err) {
        console.error(err);
    }
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    // modify discord user status
    try {
        const DateStarted = new Date(yield (0, lib_1.getDateStarted)());
        const RelativeTime = dateToRelativeTime(DateStarted);
        console.log("Running...");
        const value = yield (0, lib_1.getValue)();
        const response = yield (0, node_fetch_commonjs_1.default)("https://discord.com/api/v8/users/@me/settings", {
            method: "PATCH",
            headers: {
                Authorization: `${DISCORD_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                custom_status: {
                    text: `
                Count is: ${value};
                Count started: ${DateStarted.toLocaleString()};
            `,
                },
            }),
        });
        if (response.status !== 200) {
            console.error("Failed to update discord status", yield response.text());
            return;
        }
        (0, lib_1.incrementValue)();
        console.log(`Updated discord status to ${value}`);
    }
    catch (err) {
        console.error(err);
    }
});
process.stdin.resume(); //so the program will not close instantly
function exitHandler(options, exitCode) {
    sendOfflineNotice();
    if (options.cleanup)
        console.log("clean");
    if (exitCode || exitCode === 0)
        console.log(exitCode);
    if (exitCode)
        process.exit();
}
//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
setTimeout(() => {
    run();
}, 1000);
setInterval(run, 10000);
