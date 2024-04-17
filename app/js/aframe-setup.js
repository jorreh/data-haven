import brandsEnvMappings from "../json/brand-environment-mappings.json";
import aframeSettings from "../json/aframeSettings.json";

import { blend_colors } from "./hexColorBlender.js";
import { getGifs } from "./giphy.js";

const $ = (queryString) => document.querySelector(queryString);

const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export function getEnvironmentParams(brand, browserData, env) {
  // let envAttribute = $('a-scene').getAttribute('environment');
  // console.log('envattr', envAttribute);

  let environmentPreset = getPresetEnvironment(brand, browserData.fonts, env);

  //environmentPreset = aframeSettings.presets[0];

  let fogVal = getFog(browserData.battery.level, aframeSettings.fog.min, aframeSettings.fog.max);
  let sunlightVal = getSunlight(
    aframeSettings.lightPos.morningHour,
    aframeSettings.lightPos.eveningHour,
    aframeSettings.lightPos.minPos,
    aframeSettings.lightPos.maxPos
  );
  let skyColor = getSkyColor(
    aframeSettings.lightPos.morningHour,
    aframeSettings.lightPos.eveningHour,
    aframeSettings.skyColor.morningHex,
    aframeSettings.skyColor.eveningHex
  );
  let dressingAmount = getDressingAmount(
    browserData.general.sizeInW,
    browserData.general.sizeInH,
    aframeSettings.dressingAmount.preset[environmentPreset].min,
    aframeSettings.dressingAmount.preset[environmentPreset].max,
    aframeSettings.dressingAmount.minScreenSize,
    aframeSettings.dressingAmount.maxScreenSize
  );
  let groundColors = getGroundColors(
    brand,
    browserData.general.browserVersion1b,
    browserData.general.browserLanguage
  );
  let dressingColor =
    brand === "default" ? groundColors[0] : brandsEnvMappings[brand].dressingColor;
  let flatShading = getFlatshading(browserData.general.deviceType);
  let shadow = getShadow(browserData.general.deviceType);
  let horizonColor = getHorizonColor(browserData.battery.charging);

  return [
    aframeSettings.defaultEnvSettings,
    {
      preset: environmentPreset,
      fog: fogVal,
      lightPosition: sunlightVal,
      skyColor: skyColor,
      dressingAmount: dressingAmount,
      groundColor: groundColors[0],
      groundColor2: groundColors[1],
      dressingColor: dressingColor,
      flatShading: flatShading,
      shadow: shadow,
      //horizonColor: horizonColor
    },
  ];
}

export function setEnvironmentValues(environmentArray) {
  let $envEntity = $("#env-entity");

  // todo - delete &create new a-entity to reset (bug workaround)
  $envEntity.parentNode.removeChild($envEntity);
  $envEntity = document.createElement("a-entity");
  $envEntity.setAttribute("id", "env-entity");

  //let environmentValueString = 'preset: ' + environmentPreset + ';';
  let environmentValueString = "";

  for (let i = 0; i < environmentArray.length; i++) {
    const envValues = environmentArray[i];

    for (const [key, value] of Object.entries(envValues)) {
      //console.log(`${key}: ${value}`);
      environmentValueString += key + ": " + value + "; ";
    }
  }

  $envEntity.setAttribute("environment", environmentValueString);

  $("a-scene").appendChild($envEntity);
}

// ** gif cubes **  //
export async function setGifCubes(keywords, numberOfFonts) {
  let cubeAmount = map(
    numberOfFonts,
    10,
    109,
    aframeSettings.gifCube.minAmount,
    aframeSettings.gifCube.maxAmount
  );

  if (cubeAmount < keywords.length) cubeAmount = keywords.length; // make sure there are at least enough cubes for each keyword

  //cubeAmount = 8; // TODO - verwijderen

  let gifs = await getGifs(keywords, cubeAmount);

  //console.log(gifs);

  let $scene = $("#myscene");

  // ***** TODO - for loop, voor cubeamount
  for (let i = 0; i < cubeAmount; i++) {
    // generate random position
    let randomX = randomFloat(aframeSettings.gifCube.minX, aframeSettings.gifCube.maxX);
    let randomZ = randomFloat(aframeSettings.gifCube.minZ, aframeSettings.gifCube.maxZ);
    let randomY = randomFloat(aframeSettings.gifCube.minY, aframeSettings.gifCube.maxY);

    //console.log('x: ' + randomX, 'z: ' + randomZ + 'y: ' + randomY);

    let $cube = document.createElement("a-entity");

    $cube.setAttribute("geometry", "");
    $cube.setAttribute("position", randomX + " " + randomZ + " " + randomY);

    // animation attribute of gif cubes
    $cube.setAttribute("animation", "");
    $cube.setAttribute("class", "cube");

    $cube.setAttribute("material", `shader: gif; src: url(${gifs[i]});`);
    //$cube.setAttribute('material', `shader: gif; src: url(https://media0.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif?cid=d97c7b52rd1mkj412nvz8mpbtvnpgmht9tfh3ygi5e2c89zw&rid=giphy.gif);`);
    //$cube.setAttribute('material', `shader: gif; src: url(https://media4.giphy.com/media/q1MeAPDDMb43K/giphy.gif?cid=d97c7b5249khcskokjced6xq73jqgm0exx9intq0ogfxkr48&rid=giphy.gif);`);
    $scene.appendChild($cube);

    //await timeout(3000);
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// client extra's
export function placeLogoBanner(brand) {
  let brandLogo = brandsEnvMappings[brand].logo;

  $("#brand-banner-img").setAttribute("src", "./img/logos/" + brandLogo);
  $("#brand-banner-img").setAttribute("visible", true);
}

export function getPresetSong(preset) {
  //let presetSongArray = aframeSettings.presetSongs[preset];

  //let randomInt = Math.floor(Math.random() * presetSongArray.length) + 0;

  //let presetSong = presetSongArray[randomInt];

  let presetSong = aframeSettings.presetSongs[preset];

  return presetSong;
}

// ** PRIVATE FUNCTIONS

function getPresetEnvironment(brand, fontsArray, env) {
  if (env > 0 && env < aframeSettings.presets.length - 1) {
    return aframeSettings.presets[env];
  }

  if (brand === "default") {
    let presetIndex = 0;

    if (fontsArray.length < aframeSettings.presets.length) {
      presetIndex = fontsArray.length;
    } else {
      presetIndex = fontsArray.length % aframeSettings.presets.length;
    }

    // console.log("fonts:" + fontsArray.length);
    //console.log("n presets:" + aframeSettings.presets.length);
    console.log("preset index: " + presetIndex);

    return aframeSettings.presets[presetIndex];
  } else {
    let brandEnvMappings = brandsEnvMappings[brand];
    return brandEnvMappings.environment.preset;
  }
}

function getFog(batteryLevel, fogMin, fogMax) {
  let fogVal = map(batteryLevel, 0, 100, fogMax, fogMin);
  return fogVal;
  // $('a-scene').setAttribute('environment', 'fog: ' + fogVal);
}

function getSunlight(morningHour, eveningHour, lightPosMin, lightPosMax) {
  let dayTimeProgressInPercent = mapCurrentTimeToPercentage(morningHour, eveningHour);

  let lightZPos = map(dayTimeProgressInPercent, 0, 100, lightPosMax, lightPosMin);

  return "-1.200 " + lightZPos.toFixed(3) + " -1.550";

  // $('a-scene').setAttribute('environment', 'lightPosition: ' + '-1.200 ' + lightZPos.toFixed(3) + ' -1.550');
}

function getSkyColor(morningHour, eveningHour, skyMorningHex, skyEveningHex) {
  let dayTimeProgressInPercent = mapCurrentTimeToPercentage(morningHour, eveningHour);

  let blendPercentage = map(dayTimeProgressInPercent, 0, 100, 0.0, 1.0);

  blendPercentage = blendPercentage.toFixed(2);

  let skyColor = blend_colors(skyMorningHex, skyEveningHex, blendPercentage);
  //console.log('skycolor: ', skyColor);

  return skyColor;

  // skyColor
  // $('a-scene').setAttribute('environment', 'skyColor: ' + skyColor);
}

function mapCurrentTimeToPercentage(morningHour, eveningHour) {
  let morningDate = new Date();
  morningDate.setHours(morningHour, 0, 0, 0); // set morning time

  let eveningDate = new Date();
  eveningDate.setHours(eveningHour, 0, 0, 0); // set evening time

  let currentDate = new Date();

  if (currentDate < morningDate) {
    currentDate = morningDate;
  } else if (currentDate > eveningDate) {
    currentDate = eveningDate;
  }

  let dayTimeProgressInPercent = map(currentDate, morningDate, eveningDate, 0, 100);

  dayTimeProgressInPercent = dayTimeProgressInPercent.toFixed(2);

  return dayTimeProgressInPercent;
}

function getDressingAmount(
  screenWidth,
  screenHeight,
  dressingAmountMin,
  dressingAmountMax,
  screenSizeMin,
  screenSizeMax
) {
  let resolution = screenWidth * screenHeight;

  let dressingAmount = Math.round(
    map(resolution, screenSizeMin, screenSizeMax, dressingAmountMin, dressingAmountMax)
  );

  return dressingAmount;
}

function getGroundColors(brand, browserVersion, browserLanguage) {
  if (brand !== "default") {
    let brandEnvMappings = brandsEnvMappings[brand];
    return brandEnvMappings.groundColors;
  } else {
    let browserBasedHash = generateHash(browserVersion);
    let languageBasedHash = generateHash(browserLanguage);

    let groundColor1 = getHexColorFromSHashed(browserBasedHash);
    let groundColor2 = getHexColorFromSHashed(languageBasedHash);

    return [groundColor1, groundColor2];
  }
}

function getHorizonColor(charging) {
  return charging ? aframeSettings.horizonColor.charging : aframeSettings.horizonColor.notCharging;
}

function generateHash(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  let hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);

  return hash.toString();
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getHexColorFromSHashed(str) {
  let nineDigitsHash = str.substring(7); // grab 9 last digits

  let firstChunk = nineDigitsHash.substring(0, 3);
  let midChunk = nineDigitsHash.substring(3, 6);
  let lastChunk = nineDigitsHash.substring(6, 9);

  firstChunk = parseInt(firstChunk);
  midChunk = parseInt(midChunk);
  lastChunk = parseInt(lastChunk);

  let r = Math.round(map(firstChunk, 0, 999, 0, 255));
  let g = Math.round(map(midChunk, 0, 999, 0, 255));
  let b = Math.round(map(lastChunk, 0, 999, 0, 255));

  let hex = rgbToHex(r, g, b);

  return hex;
}

function getFlatshading(deviceType) {
  return deviceType === "mobile" ? true : false;
}

function getShadow(deviceType) {
  return deviceType === "mobile" ? false : true;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
  let random = Math.random() * (max - min) + min;
  return random.toFixed(1);
}
