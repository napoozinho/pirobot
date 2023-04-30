"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Events } = require("discord.js");
module.exports = {
    name: Events.MessageCreate,
    on: true,
    execute(interaction) {
        if (interaction.author.bot)
            return;
    },
};
//# sourceMappingURL=talk.js.map