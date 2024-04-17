import {getUrlParam } from './browserData.js';

const $ = (queryString) => document.querySelector(queryString);

let keyword = "";

let brand = getUrlParam('brand') || 'default';

let preloaderFinishedCallback = {};

let keyWordSubmitCallback = {};

export function onKeywordSubmit(callback){
    keyWordSubmitCallback = callback;
}

$("#btn-gotodataheaven").addEventListener("click", function () {

    keyWordSubmit()
});

$("#keyword").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        keyWordSubmit();
    }
});

function keyWordSubmit() {

    let keywordVal = $("#keyword").value;

    if (keywordVal === '') {
        return false;
    }

    keyword = keywordVal;

    showDataHavenLoader();
    keyWordSubmitCallback(keyword);

}

export function onDataHeavenPreloaderFinished(callback) {
    preloaderFinishedCallback = callback;
}

export function removeKeywordInputPage() {
    $("#page3").style.display = "none";
}

export function showTakeMeToDataHavenBtn(){
    $("#btn-gotodataheaven-page2").style.display = "flex";
}

export function insertBrowserDataInWhyThisHavenBox(browserData) {

    $('#charging').innerHTML = browserData.battery.charging;
    $('#level').innerHTML = browserData.battery.level;
    $('#chargingTime').innerHTML = browserData.battery.chargingTime;
    $('#dischargingTime').innerHTML = browserData.battery.dischargingTime;
    
    $('#browserEngine').innerHTML = browserData.general.browserEngine;
    $('#browserLanguage').innerHTML = browserData.general.browserLanguage;
    $('#browserName').innerHTML = browserData.general.browserName;
    $('#browserOnline').innerHTML = browserData.general.browserOnline;
    $('#browserPlatform').innerHTML = browserData.general.browserPlatform;
    $('#browserVersion1b').innerHTML = browserData.general.browserVersion1b;
    $('#dataCookiesEnabled').innerHTML = browserData.general.dataCookiesEnabled;
    $('#deviceType').innerHTML = browserData.general.deviceType;
    $('#javaEnabled').innerHTML = browserData.general.javaEnabled;
    $('#previousSites').innerHTML = browserData.general.previousSites;
    $('#scrColorDepth').innerHTML = browserData.general.scrColorDepth;
    $('#scrPixelDepth').innerHTML = browserData.general.scrPixelDepth;
    $('#sizeScreenW').innerHTML = browserData.general.sizeScreenW;
    $('#sizeScreenH').innerHTML = browserData.general.sizeScreenH;
    $('#sizeInW').innerHTML = browserData.general.sizeInW;
    $('#sizeInH').innerHTML = browserData.general.sizeInH;
    $('#timeOpened').innerHTML = browserData.general.timeOpened;
    

}

// if client clicks -> straight to loader. Else -> go to screen below
$("#btn-gotodataheaven-page2").addEventListener("click", function () {

    showDataHavenLoader();

});

$("#whythishaven-close").addEventListener("click", function () {
    $('#content-wrapper').style.display = 'none';
});

$("#whythishaven-btn-wrapper").addEventListener("click", function () {
    $('#content-wrapper').style.display = 'block';
});


function showDataHavenLoader() {

    $("#dataHavenLoader").style.display = "flex";
    $("#lp-wrapper").style.display = "none";

    startProgressBar();

}


function startProgressBar() {

    var i = 0;
    let progTxtIndex = 0;

    updateProgressTxt(0);

    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                onDataHavenLoaderFinished();
            } else {
                width++;
                elem.style.width = width + "%";
                if (width === 0 || width%10 === 0){
                    updateProgressTxt(progTxtIndex);
                    progTxtIndex++;
                }
                
            }
        }
    }
}

function updateProgressTxt(i){
    let nonsenseProgress = [
        "[1/10] Converting battery data to fauna and flora",
        "[2/10] Measuring distance between interstellar objects",
        "[3/10] Extrapolating the origins of time to hex values ",
        "[4/10] Checking fonts",
        "[5/10] Updating plumbus",
        "[6/10] Smoothing up dinglebob with a bunch of shleem",
        "[7/10] Oiling qubits to minimize friction",
        "[8/10] Measuring Bloch sphere",
        "[9/10] Applying Bose-Einstein Condensate",
        "[10/10] Measuring drag coefficient of purple mushrooms",
    ]

    $("#loaderProgressTxt").innerHTML = nonsenseProgress[i];

}

function onDataHavenLoaderFinished() {

    setTimeout(() => {
        showAframeWrapper();
        showDataHavenOverlayer();
        hideDataHavenLoader();
        preloaderFinishedCallback();
    }, 1000);
}

function hideDataHavenLoader(){
    $("#dataHavenLoader").style.display = "none";
}

function showDataHavenOverlayer() {
    //$("#dataHavenOverLayer").style.display = "flex";
    $('#asn-undefined-logo-overscene').style.display = "block";
    //$('#whythishaven-wrapper').style.display = "block";
    $('#welcome-to-datahaven-popup').style.display = "block";
    // whythishaven-wrapper
}

function showAframeWrapper() {
    $("#myscene").style.visibility = "visible";
}

