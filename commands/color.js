const { Command } = require("discord-akairo");
const { setColor, turnOff, animate } = require("../lights");
const parse = require("color-parse");

class ColorCommand extends Command {
  constructor() {
    super("color", {
      aliases: ["color"],
    });
  }

  async exec(message) {
    const request = message.content.replace(/^\/color\s+/i, "").split(/\s+/);
    if (request.length === 1 && request[0].toLowerCase() === "off") {
      await turnOff();
      return message.reply(`Turning off`);
    } else if (request.length === 1 && request[0].toLowerCase() === "animate") {
      await animate();
      return message.reply(`Animating`);
    } else if (request.length === 1 && request[0].toLowerCase() === "stop") {
      await animate();
      return message.reply(`Turning animation off`);
    } else {
      const parseColor = (text) => {
        const color = parse(text);
        if (color && color.values && color.values.length) {
          return color.values;
        }
        return [255, 255, 255];
      };
      const colors = request.map((color) => parseColor(color));
      await setColor(colors);
      return message.reply(
        `Color set to ${colors
          .map((color) => JSON.stringify(color))
          .join(", ")}`
      );
    }
  }
}

module.exports = ColorCommand;
