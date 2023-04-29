"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const commands = [];
const foldersPath = node_path_1.default.join(__dirname, "commands");
const commandFiles = fs_1.default.readdirSync(foldersPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const filePath = node_path_1.default.join(foldersPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
// Construct and prepare an instance of the REST module
const rest = new discord_js_1.REST().setToken(process.env.TOKEN);
console.log(commands);
// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(discord_js_1.Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
//# sourceMappingURL=deploy-commands.js.map