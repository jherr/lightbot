const Hue = require("node-hue-api");

const v3 = Hue.v3;
const LightState = v3.lightStates.LightState;

const OFFICE_LIGHTS = ["Jack office 1", "Jack office 2"];

let api = null;

const turnOff = async (name) => {
  const light = await api.lights.getLightByName(name);
  if (light) {
    await api.lights.setLightState(
      light.id,
      new LightState().on(false).transitionSlow()
    );
  }
};

const startEffect = async (name) => {
  const light = await api.lights.getLightByName(name);
  if (light) {
    await api.lights.setLightState(
      light.id,
      new LightState().on(true).effectColorLoop()
    );
  }
};

const stopEffect = async (name) => {
  const light = await api.lights.getLightByName(name);
  if (light) {
    await api.lights.setLightState(
      light.id,
      new LightState().on(true).effectNone()
    );
  }
};

const setLight = async (name, color) => {
  const light = await api.lights.getLightByName(name);
  if (light) {
    await api.lights.setLightState(
      light.id,
      new LightState()
        .on(true)
        .effectNone()
        .rgb(...color)
        .brightness(100)
        .transitionSlow()
    );
  }
};

let animateInterval = null;
const stopInterval = () => {
  if (animateInterval) {
    clearInterval(animateInterval);
    animateInterval = null;
  }
};

const setup = async () => {
  if (!api) {
    console.log("Setting up");
    const searchResults = await v3.discovery.nupnpSearch();
    api = await v3.api
      .createLocal(searchResults[0].ipaddress)
      .connect(process.env.HUE_BRIDGE_USER);
    console.log("Setting up done");
  }
};

const lights = {
  setColor: async (colors) => {
    await setup();
    stopInterval();

    if (colors.length <= 2) {
      await setLight(OFFICE_LIGHTS[0], colors[0]);
      await setLight(OFFICE_LIGHTS[1], colors[1] || colors[0]);
    } else if (colors.length === 4) {
      let index = 0;
      const setLights = async () => {
        if (index % 2 === 0) {
          await setLight(OFFICE_LIGHTS[0], colors[0]);
          await setLight(OFFICE_LIGHTS[1], colors[1]);
        } else {
          await setLight(OFFICE_LIGHTS[0], colors[2]);
          await setLight(OFFICE_LIGHTS[1], colors[3]);
        }
      };
      animateInterval = setInterval(() => {
        setLights();
        index += 1;
      }, 5000);
    }
  },
  turnOff: async () => {
    await setup();
    stopInterval();

    await turnOff(OFFICE_LIGHTS[0]);
    await turnOff(OFFICE_LIGHTS[1]);
  },
  animate: async () => {
    await setup();
    stopInterval();

    await startEffect(OFFICE_LIGHTS[0]);
    await startEffect(OFFICE_LIGHTS[1]);
  },
  stop: async () => {
    await setup();
    stopInterval();

    await stopEffect(OFFICE_LIGHTS[0]);
    await stopEffect(OFFICE_LIGHTS[1]);
  },
};

module.exports = lights;
