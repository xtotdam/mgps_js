var pos_info = {
    lat: "0.000000", long: "0.000000", alt: "0.0"
};

// Helpers
function format_number(x, prec, parent_elem) {
    try {
        var r = x.toFixed(prec);
        $(parent_elem).show();
        return r;
    } catch (error) {
        // return "&mdash;"
        $(parent_elem).hide();
    }
}

function download(filename, text) {
    // https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Update top of screen
function update_geoinfo() {
    // $("span#timestamp").html(format_time(window.pos_info.timestamp));
    $("span#timestamp").html(new Date(pos_info.timestamp).toLocaleTimeString());
    $("span#lat").html(pos_info.lat.toString());
    $("span#long").html(pos_info.long.toString());
    $("span#pos_acc").html(format_number(pos_info.acc, 2) + ' м');

    $("span#alt").html(format_number(pos_info.alt, 1, "div#alt"));
    $("span#alt_acc").html('<i class="fa-solid fa-plus-minus"></i>' + format_number(pos_info.alt_acc, 1, "span#alt_acc") + ' м');

    // $("span#head").html(format_number(pos_info.head, 0, "div#head") + '°');
    // $("span#speed").html(format_number(pos_info.speed, 1, "div#speed") + ' м/с');
}

// Update textarea
function update_found_log() {
    var history = JSON.parse(localStorage.getItem("MGPSHistory"));

    var log = new Array();
    for (let i = 0; i < history.length; i++) {
        var point = history[i];
        log.push(`${i+1}: ${point.title} в ${new Date(point.timestamp_real).toLocaleTimeString()}`);
    }

    $('#found_log').val(log.reverse().join('\n'));
    // $('#found_log').scrollTop = $('#found_log').scrollHeight;
}

// Handle user choice
function get_choice(cat, name) {
    var history = localStorage.getItem("MGPSHistory");
    if (history === null) {
        history = new Array();
    }
    else {
        history = JSON.parse(history);
    }

    date = new Date();

    var entry = {
        category: cat,
        title: name,

        latitude: pos_info.lat,
        longitude: pos_info.long,
        accuracy: pos_info.acc,
        altitude: pos_info.alt,
        altaccurary: pos_info.alt_acc,
        // heading: pos_info.head,
        // speed: pos_info.speed,

        timestamp_real: date.getTime(),
        timestamp_gps: pos_info.timestamp,

        isotime_real: date.getTime(),

        datetime_real: date.toString(),
        datetime_gps: new Date(pos_info.timestamp).toString(),
    };

    history.push(entry);
    localStorage.setItem("MGPSHistory", JSON.stringify(history));
    update_found_log();
}

// Download files
function download_json() {
    var filename = `MushroomGPS_${new Date().toISOString().replaceAll(':','-')}.json`
    var history = localStorage.getItem("MGPSHistory");
    var jsonstring = JSON.stringify(JSON.parse(history), null, 2);
    download(filename, jsonstring);
}

function download_gpx() {
    var head = `\
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<gpx version="1.1" creator="MushroomGPS" xmlns="http://www.topografix.com/GPX/1/1" xmlns:osmand="https://osmand.net" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata><name>MushroomGPS ${new Date().toISOString()}</name><author>MushroomGPS</author></metadata>\n`;

    var tail = `\n\n</gpx>`

    var history = JSON.parse(localStorage.getItem("MGPSHistory"));
    var waypoints = new Array();
    for (point of history)
    {
        var isotime_real = new Date(point.timestamp_real).toISOString();

        waypoints.push(`
<wpt lat="${point.latitude}" lon="${point.longitude}">
<ele>${point.altitude}</ele>
<name>${point.title}</name>
<time>${isotime_real}</time>
<desc>category=${point.category}, date=${isotime_real}</desc>
<hdop>${point.accuracy}</hdop>
<extensions>
<osmand:color></osmand:color>
<osmand:icon></osmand:icon>
<category>${point.category}</category>
</extensions>
</wpt>`);
    }

    var wpts = waypoints.join('\n\n');

    var filename = `MushroomGPS_${new Date().toISOString().replaceAll(':','-')}.gpx`
    download(filename, head + wpts + tail);
}

// Manage storage
function clear_last() {
    var history = JSON.parse(localStorage.getItem("MGPSHistory"));
    history.pop();
    localStorage.setItem("MGPSHistory", JSON.stringify(history));
    update_found_log();
}

function clear_all() {
    localStorage.setItem("MGPSHistory", JSON.stringify(new Array()));
    update_found_log();
}

/////////////////

var geo_options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
};

// Put geo information into global variable
function geo_success(pos) {
    // alert(pos.timestamp);
    pos_info.timestamp = pos.timestamp;
    pos_info.lat =       pos.coords.latitude;
    pos_info.long =      pos.coords.longitude;
    pos_info.acc =       pos.coords.accuracy;
    pos_info.alt =       pos.coords.altitude;
    pos_info.alt_acc =   pos.coords.altitudeAccuracy;
    // pos_info.head =      pos.coords.heading;
    // pos_info.speed =     pos.coords.speed;
}

function geo_error(err) {
    // window.alert(`ERROR(${err.code}): ${err.message}`);
    $('#last_error').html(`${strftime('%X')}: (${err.code}) ${err.message}`);
}

if (navigator.geolocation) {
    var geowatchID = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
}


function time_loop() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    }

    // if (geoPosition.init()) {
    //     geoPosition.getCurrentPosition(geo_success, geo_error, geo_options);
    // }

    update_geoinfo();

    // $("#refresh_time").html(`${strftime('%X')}`);
    $("#refresh_time").html(((pos_info.timestamp - new Date().getTime())/1000).toFixed(2) + ' с');
}

var intervalID = setInterval(time_loop, 3000);

var showtimeID = setInterval(function(){
    $("span#delta_time").html(((pos_info.timestamp - new Date().getTime())/1000).toFixed(2) + ' с');
}, 500);
