"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mondayPrediction = exports.getRandomMember = exports.isLeap = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
function isLeap(year) {
    return year % 400 === 0 ? true : year % 100 === 0 ? false : year % 4 === 0;
}
exports.isLeap = isLeap;
async function getRandomMember(active_guild) {
    let guild_members = [];
    const members = await active_guild.members.fetch();
    await members.forEach((member) => {
        if (!member.user.bot) {
            guild_members.push(member.user.username);
        }
    });
    return guild_members[Math.floor(Math.random() * guild_members.length)];
}
exports.getRandomMember = getRandomMember;
function mondayPrediction(active_guild) {
    const current_date = new Date();
    const start_date = new Date(current_date.getFullYear(), 0, 1);
    const current_date_timestamp = current_date.getTime();
    const start_date_timestamp = start_date.getTime();
    const days = Math.floor((current_date_timestamp - start_date_timestamp) / (24 * 60 * 60 * 1000));
    const week_number = Math.ceil(days / 7);
    async function getResponse() {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Pretend you are a super-intelligent AI that can see the future one week in advance. Today we are going through the week number ${week_number} of the year, come up with a global prediction for this week in a severe and tragic tone, your prediction is an analogy for creation, make sure you use the name '${await getRandomMember(active_guild)}' in your prediction, follow the next examples:
        "This week marks the end of all certainty, as ${await getRandomMember(active_guild)} unmistakable omens of destruction arise without exclusion." ~ Theognis of Megara
        "As the 20th week days pass, the relentless menace of ${await getRandomMember(active_guild)} unwelcomed destruction visible on this seemingly unconquerable horizon." ~ Arthur Miller
        "`,
            max_tokens: 100,
            temperature: 1.33,
            frequency_penalty: 1,
        });
        return response;
    }
    getResponse().then((result) => {
        let week_cap = 52;
        if (isLeap(current_date.getFullYear()))
            week_cap++;
        let weekly_channel;
        let tick = "```";
        let weekly = `${tick}css\n#week-${week_number}/${week_cap}\n\n["${result.data.choices[0].text}]\n${tick}`;
        for (const channels of active_guild.channels.cache) {
            for (const channel of channels) {
                if (channel.name == "pirobot") {
                    weekly_channel = channel;
                }
            }
        }
        weekly_channel.send(weekly);
    });
}
exports.mondayPrediction = mondayPrediction;
//# sourceMappingURL=utils.js.map