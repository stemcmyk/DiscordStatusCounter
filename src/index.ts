import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch-commonjs";

import { getDateStarted, getValue, incrementValue } from "./lib";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const dateToRelativeTime = (date: Date) => {
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

const sendOfflineNotice = async () => {
  console.log("sendOfflineNotice");
  try {
    const response = await fetch(
      "https://discord.com/api/v8/users/@me/settings",
      {
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
      }
    );

    if (response.status !== 200) {
      console.error("Failed to update discord status", await response.text());
      return;
    }
    console.log(`Updated discord status to offline`);
  } catch (err) {
    console.error(err);
  }
};

const run = async () => {
  // modify discord user status
  try {
    const DateStarted = new Date(await getDateStarted());
    const RelativeTime = dateToRelativeTime(DateStarted);
    console.log("Running...");

    const value = await getValue();
    const response = await fetch(
      "https://discord.com/api/v8/users/@me/settings",
      {
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
      }
    );
    if (response.status !== 200) {
      console.error("Failed to update discord status", await response.text());
      return;
    }
    incrementValue();
    console.log(`Updated discord status to ${value}`);
  } catch (err) {
    console.error(err);
  }
};

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options: any, exitCode: any) {
  sendOfflineNotice();
  if (options.cleanup) console.log("clean");
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (exitCode) process.exit();
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
