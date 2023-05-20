const { Events } = require("discord.js");
import { mondayPrediction } from "../utils/utils";
let CronJob = require("cron").CronJob;
import dotenv from "dotenv";
dotenv.config();

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(interaction) {
    console.log(`Ready! Logged in as ${interaction.user.tag}`);

    //quedo mas o menos andando, pero no se como hacer para que se ejecute en el canal de weekly
    const active_guild = interaction.guilds.cache.get(process.env.ACTIVE_GUILD);

    new CronJob(
      //make weekly
      //"* * * * *",
      "0 8 * * 1",
      () => {
        mondayPrediction(active_guild);
      },
      null,
      true,
      "America/Argentina/Buenos_Aires"
    );
  },
};
