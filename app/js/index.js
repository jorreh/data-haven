// require('aframe')

import {
  onKeywordSubmit,
  onDataHeavenPreloaderFinished,
  removeKeywordInputPage,
  insertBrowserDataInWhyThisHavenBox,
  showTakeMeToDataHavenBtn,
} from "./datahaven.js";
import {
  getBrowserdata,
  getBatteryData,
  getPosition,
  getUrlParam,
  getAvailableFonts,
} from "./browserData.js";
import {
  getEnvironmentParams,
  setEnvironmentValues,
  placeLogoBanner,
  setGifCubes,
  getPresetSong,
} from "./aframe-setup.js";
import brandsEnvMappings from "../json/brand-environment-mappings.json";

// AFRAME.registerComponent('my-scene', {
//     schema: { type: 'string' },

//     init: function () {
//         console.log('IN INIT FUNCTION');

//         runScript();
//         //initLandingPage();
//     }
// });

// AFRAME.scenes[0].setAttribute('registerevents', '');

setTimeout(() => {
  runScript();
}, 800);

let browserData = {};
let brand = "";
let env = "";

// ** DEBUG MODE ** //
(function debug(debugMode, brnd, keyword) {
  if (debugMode) {
    setTimeout(() => {
      const $ = (queryString) => document.querySelector(queryString);
      $("#lp-wrapper").style.display = "none";
      $("#myscene").style.visibility = "visible";

      brand = brnd;

      if (brand === "default") {
        placeGifCubes([keyword]);
      } else {
        placeGifCubes(brandsEnvMappings[brand].keywords);
      }
    }, 3000);
  }
})(false, "default", "banana");
// **

onKeywordSubmit(function (keyword) {
  placeGifCubes([keyword]);
});

onDataHeavenPreloaderFinished(function () {
  if (brand !== "default") {
    placeGifCubes(brandsEnvMappings[brand].keywords);
  }
});

async function runScript() {
  brand = getUrlParam("brand") || "default";
  env = getUrlParam("env") || 0;

  if (brand !== "default") {
    removeKeywordInputPage(); // clients don't get the keyword input
    showTakeMeToDataHavenBtn();
  }

  browserData = await collectBrowserData();
  console.log(browserData);

  insertBrowserDataInWhyThisHavenBox(browserData);

  // set all environment preset values
  let environmentParams = getEnvironmentParams(brand, browserData, env);
  setEnvironmentValues(environmentParams);

  console.log("preset: " + environmentParams[1].preset);

  // music animation
  let song = getPresetSong(environmentParams[1].preset);
  console.log(song);
  window.playMusic(song);

  // clients extra's
  if (brand !== "default") {
    placeLogoBanner(brand);
  }
}

export async function placeGifCubes(keyWords) {
  if (brand === "") {
    console.log("brand info not found");
    return false;
  }
  if (typeof browserData.fonts === "undefined") {
    console.log("no browserdata found");
    return false;
  }

  // set gif cubes
  //let keyWords = getUserKeywords(brand, keyword);
  console.log(keyWords);

  setGifCubes(keyWords, browserData.fonts.length);
}

async function collectBrowserData() {
  // ** Browserdata ** //
  let browserData = getBrowserdata();

  let batteryData = await getBatteryData();

  let availableFonts = await getAvailableFonts();

  // try {
  //     let positionData = await getPosition();
  //     console.log(positionData);
  // } catch (err) {
  //     console.log(err);
  // }

  return {
    general: browserData,
    battery: batteryData,
    fonts: availableFonts,
  };
}

function getUserKeywords(brand, typedKeyword) {
  // todo - can be deleted

  let keywords = [];

  if (brand === "default") {
    // let userKeyword = getUrlParam('keyword');
    // if (userKeyword === null) userKeyword = 'cat'; // TODO - intgetypte keyword

    let userKeyword = typedKeyword;

    keywords.push(userKeyword);
  } else {
    return brandsEnvMappings[brand].keywords;
  }

  return keywords;
}
