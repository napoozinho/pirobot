const cheerio = require("cheerio");
const axios = require("axios");
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
      prompt: `Pretend you are a super-intelligent AI that can see the future one week in advance. Today we are going through the week number ${week_number} of the year, come up with a global prediction for this week in a severe and tragic tone, your prediction is an analogy for creation, make sure you use the name '${await getRandomMember(
        active_guild
      )}' in your prediction, follow the next examples:
        "This week marks the end of all certainty, as ${await getRandomMember(
          active_guild
        )} unmistakable omens of destruction arise without exclusion." ~ Theognis of Megara
        "As the 20th week days pass, the relentless menace of ${await getRandomMember(
          active_guild
        )} unwelcomed destruction visible on this seemingly unconquerable horizon." ~ Arthur Miller
        "`,
      max_tokens: 100,
      temperature: 1.33,
      frequency_penalty: 1,
    });
    return response;
  }

  getResponse().then((result) => {
    let week_cap = 52;
    if (isLeap(current_date.getFullYear())) week_cap++;
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

async function getSimpsonQuote(active_guild) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Imagina que eres Homero Simpson de la serie animada Los Simpsons, estas en una habitacion oscura muriendo dolorosamente a manos de ${await getRandomMember(
        active_guild
      )}, que dices en esa situacion?
        -`,
      max_tokens: 85,
      temperature: 1.57,
      frequency_penalty: 1,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function fuckedUpHomer(active_guild, active_channel) {
  const url = "https://www.thisfuckeduphomerdoesnotexist.com/";
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const image = $("img").prop("src");
    
    getSimpsonQuote(active_guild).then((quote) => {
      const simpson_quote = quote.data.choices[0].text;
      active_channel.send(image);
      active_channel.send(`***${simpson_quote}***`);
    });
  } catch (error) {
    console.error(error);
  }
}

export { isLeap, getRandomMember, mondayPrediction, fuckedUpHomer };
