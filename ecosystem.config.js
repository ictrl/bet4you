
module.exports = {
  apps: [
    {
      name: "odds",
      script: "./odds.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
    },
    {
      name: "session",
      script: "./session.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
    },
    {
      name: "scorecard",
      script: "./scorecard.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
    },
    {
      name: "casino",
      script: "./casino.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
    },
  ],
};

