"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Events } = require("discord.js");
const utils_1 = require("../utils/utils");
let CronJob = require("cron").CronJob;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
        new CronJob("0 8 * * 1", //At 08:00 AM, only on Monday
        () => {
            (0, utils_1.mondayPrediction)(active_guild);
        }, null, true, "America/Argentina/Buenos_Aires");
        //simpson event
        new CronJob("11 1 */2 * *", //At 01:11 AM, every 2 days
        () => {
            (0, utils_1.fuckedUpHomer)(active_guild, active_general);
        }, null, true, "America/Argentina/Buenos_Aires");
    },
};
//# sourceMappingURL=ready.js.map