const { Events } = require("discord.js");
import { mondayPrediction, fuckedUpHomer } from "../utils/utils";
let CronJob = require("cron").CronJob;
import dotenv from "dotenv";
dotenv.config();

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(interaction) {
    console.log(`Ready! Logged in as ${interaction.user.tag}`);

    //active guild
    const active_guild = interaction.guilds.cache.get(process.env.ACTIVE_GUILD);
    //active general channel
    let active_general;
    for (const channels of active_guild.channels.cache) {
      for (const channel of channels) {
        if (channel.name == "pirobot") {
          active_general = channel;
        }
      }
    }

    //monday prediction event
    new CronJob(
      "0 8 * * 1", //At 08:00 AM, only on Monday
      () => {
        mondayPrediction(active_guild);
      },
      null,
      true,
      "America/Argentina/Buenos_Aires"
    );

    //simpson event
    new CronJob(
      "11 1 */2 * *", //At 01:11 AM, every 2 days
      () => {
        fuckedUpHomer(active_guild, active_general);
      },
      null,
      true,
      "America/Argentina/Buenos_Aires"
    );
  },
};
