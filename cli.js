const ColorCommand = require("./commands/color");

(async function () {
  const c = new ColorCommand();
  await c.exec({
    // content: "/color stop",
    // content: "/color animate",
    // content: "/color red green",
    content: "/color red green blue yellow",
    reply: console.log,
  });
})();
