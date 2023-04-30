import dotenv from "dotenv";
dotenv.config();

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

function isLeap(year): boolean {
  return year % 400 === 0 ? true : year % 100 === 0 ? false : year % 4 === 0;
}

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

function sendWeekly(active_guild) {
  // dates and shit
  const current_date = new Date();
  const start_date = new Date(current_date.getFullYear(), 0, 1);
  const current_date_timestamp = current_date.getTime();
  const start_date_timestamp = start_date.getTime();
  const days = Math.floor((current_date_timestamp - start_date_timestamp) / (24 * 60 * 60 * 1000));
  const week_number = Math.ceil(days / 7);

  async function getResponse() {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write a quote for opening a book and an author's name in a dark, creepy, and obscure manner, making sure the quote is dedicated to "${await getRandomMember(
        active_guild)}":
        "The shadows of this world are deep, and ${await getRandomMember(active_guild)} knows their secrets - for only in the deepest darkness can truth be found." ~ Johnathan Dalton
        "${await getRandomMember(active_guild)}, unlock the mysteries of the night, for only through its depths can you find the truth." ~ John Milton
        "Let ${await getRandomMember(active_guild)} traverse the chasms of the night, for only then can the secrets be revealed." ~ David Frost
        "`,
      max_tokens: 100,
      temperature: 0.8,
      frequency_penalty: 1,
    });
    return response;
  }

  getResponse().then((result) => {
    let week_cap = 52;
    if (isLeap(current_date.getFullYear())) week_cap++;

    let tick = "```";
    let weekly = `${tick}css\n#week-${week_number}/${week_cap}\n\n["${result.data.choices[0].text}]\n${tick}`;

    console.log("IN: " + result.data.choices[0].text);

    //aca se rompe anashe
    active_guild.channel.send(weekly);
  });
}

export { isLeap, getRandomMember, sendWeekly };
