module.exports = {
  apps: [
    {
      name: "odds",
      script: "./odds.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
      node_args: "--max_old_space_size=6144",
    },
    {
      name: "session",
      script: "./session.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
      node_args: "--max_old_space_size=6144",
    },
    {
      name: "scorecard",
      script: "./scorecard.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
      node_args: "--max_old_space_size=6144",
    },
    {
      name: "casino",
      script: "./casino.js",
      instances: 1,
      cron_restart: "30 21 * * *",
      max_memory_restart: "5G",
      node_args: "--max_old_space_size=6144",
    },
  ],
};
