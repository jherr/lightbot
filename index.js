const { AkairoClient, CommandHandler } = require("discord-akairo");

class MyClient extends AkairoClient {
  constructor() {
    super({}, {});
    this.commandHandler = new CommandHandler(this, {
      directory: "./commands/",
      prefix: "/",
    });
    this.commandHandler.loadAll();
  }
}

const client = new MyClient();
client.login(process.env.DISCORD_BOT_KEY);
