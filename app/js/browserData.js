
export async function getBatteryData() {

    return new Promise(async (resolve, reject) => {

        let isBatterySupported = 'getBattery' in navigator;

        let batteryData = {};

        if (!isBatterySupported) {
            resolve(false);
        } else {
            let battery = await navigator.getBattery();
            batteryData['charging'] = battery.charging;
            batteryData['level'] = battery.level * 100
            batteryData['chargingTime'] = battery.chargingTime;
            batteryData['dischargingTime'] = battery.dischargingTime;
            resolve(batteryData);
        }

    });

}

export async function getPosition() {

    return new Promise(async (resolve, reject) => {

        navigator.geolocation.getCurrentPosition(function (position) {

            let pos = {};

            pos['latitude'] = position.coords.latitude;
            pos['latitude'] = position.coords.longitude;
            pos['latitude'] = position.coords.accuracy;
            pos['latitude'] = position.coords.altitude;
            pos['latitude'] = position.coords.altitudeAccuracy;
            pos['latitude'] = position.coords.heading;
            pos['latitude'] = position.coords.speed;
            pos['latitude'] = position.coords.timestamp;

            resolve(pos);

        }, function (GeolocationPositionError) { // TODO - ik weet niet of deze functie werkt
            reject(GeolocationPositionError);
        },
            { timeout: 4000 });

    })

}

export function getBrowserdata() {

    let browserData = {};

    browserData['timeOpened'] = new Date();
    browserData['referrer'] = document.referrer;
    browserData['pageon'] = window.location.pathname;
    browserData['previousSites'] = history.length;
    browserData['browserName'] = navigator.appName;
    browserData['browserEngine'] = navigator.product;
    browserData['browserVersion1a'] = navigator.appVersion;
    browserData['browserVersion1b'] = navigator.userAgent;
    browserData['deviceType'] = getDeviceType();
    browserData['browserLanguage'] = navigator.language;
    browserData['browserOnline'] = navigator.onLine;
    browserData['browserPlatform'] = navigator.platform;
    browserData['javaEnabled'] = navigator.javaEnabled();
    browserData['sizeScreenW'] = screen.width;
    browserData['sizeScreenH'] = screen.height;
    // browserData['sizeDocW'] = document.width;
    // browserData['sizeDocH'] = document.height;
    browserData['sizeInW'] = window.innerWidth;
    browserData['sizeInH'] = window.innerHeight;
    browserData['sizeAvailW'] = screen.availWidth;
    browserData['sizeAvailH'] = screen.availHeight;
    browserData['scrColorDepth'] = screen.colorDepth;
    browserData['scrPixelDepth'] = screen.pixelDepth;
    browserData['dataCookiesEnabled'] = navigator.cookieEnabled;
    browserData['dataCookies1'] = document.cookie;
    browserData['dataCookies2'] = decodeURIComponent(document.cookie.split(";"));
    browserData['localStorage'] = JSON.stringify(localStorage);

    return browserData;
};

export function getUrlParam(name) {
    
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export async function getAvailableFonts(){
    const fontCheck = new Set([
        // Windows 10
        'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
        // macOS
        'American Typewriter', 'Andale Mono', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Copperplate', 'Courier', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Times', 'Trattatello', 'Zapfino'
    ].sort());

    await document.fonts.ready;

    let fontAvailable = [];

    for (const font of fontCheck.values()) {
        if (document.fonts.check(`12px "${font}"`)) {
            fontAvailable.push(font);
        }
    }

    return fontAvailable;

}


function getDeviceType() {
    var ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "mobile";
    }
    return "desktop";
}
