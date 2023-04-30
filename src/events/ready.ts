const { Events } = require("discord.js");
import { sendWeekly } from "../utils/utils";
let CronJob = require("cron").CronJob;
import dotenv from "dotenv";
dotenv.config();

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(interaction) {
    console.log(`Ready! Logged in as ${interaction.user.tag}`);

    //intento de obtener guild+text channel weekly
    async function getWeeklyChannel() {
      const weekly_guild = await interaction.guilds.fetch()
      weekly_guild.forEach((guild) => {
        if (guild.id === process.env.ACTIVE_GUILD) {
          return guild;
        }
      })
    }
    getWeeklyChannel().then(console.log)

    //quedo mas o menos andando, pero no se como hacer para que se ejecute en el canal de weekly
    const active_guild = interaction.guilds.cache.get(process.env.ACTIVE_GUILD);

    new CronJob(
      //make weekly
      "* * * * *",
      () => {
        sendWeekly(active_guild);
      },
      null,
      true,
      "America/Argentina/Buenos_Aires"
    );
  },
};
