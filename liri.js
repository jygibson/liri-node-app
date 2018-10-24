require("dotenv").config();
var moment = require("moment");
var spotifyReq = require('node-spotify-api');
var omdb = require("omdb")
var request = require("request");
var fs= require("fs");
var keysFile = require("./keys.js")
// console.log(keysFile)

// 8. Add the code required to import the `keys.js` file and store it in a variable.

// * You should then be able to access your keys information like so

//   ```js
//   var spotify = new Spotify(keys.spotify);
//   ```

var action = process.argv[2];
var searchInput = process.argv;
var inputName = "";

for (i = 3; i < searchInput.length; i++) {
    if (i > 3 && i < searchInput.length) {
        inputName = inputName + " " + searchInput[i]
    }
    else {
        inputName += searchInput[i];
    };
}

var omdbUrl = "http://www.omdbapi.com/?t=" + inputName + "&y=&plot=short&apikey=trilogy";
var bitUrl = "https://rest.bandsintown.com/artists/" + inputName + "/events?app_id=codingbootcamp"

switch (action) {
    case "concert-this":
        concertSearch();
        break;

    case "spotify-this-song":
        songSearch();
        break;

    case "movie-this":
        movieSearch();
        break;

    case "do-what-it-says":
    doWhatItSays();
        break;
}

function concertSearch() {
    request(bitUrl, function (error, response) {
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(response.body).length);
            for(let i=0; i < JSON.parse(response.body).length ; i++){
                console.log(inputName + " is playing at " + JSON.parse(response.body)[i].venue.name);
                console.log("The venue is located in " + JSON.parse(response.body)[i].venue.city);
                var concert = JSON.parse(response.body)[i].datetime;
                var concertinfo= moment(concert).format("dddd, MMMM Do YYYY");
                console.log(concertinfo)
            };
        }
    });
}

function songSearch() {
    var spotify = new spotifyReq(keysFile.spotify);
    spotify.search({ type: 'track', query: inputName}, function(error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
//artist, song, preview link, album
        console.log("The requested song is by " + data.tracks.items[0].artists[0].name);
        console.log("The song is "+ data.tracks.items[0].name);
        console.log("You can sample this song at " + data.tracks.items[0].preview_url);
        console.log("This song is on the album " + data.tracks.items[0].album.name);
    });
}

function movieSearch() {
    request(omdbUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("The movie title is " + inputName);
            console.log("The movie was released in " + JSON.parse(body).Released);
            console.log(inputName + " is rated " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes gave " + inputName + " a rating of " + JSON.parse(body).Ratings[1].Value);
            console.log(inputName + " is from " + JSON.parse(body).Country);
            console.log(inputName + " is in " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log(inputName + " stars the following actors: " + JSON.parse(body).Actors)
        }
    });
}

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error,data){
        if (error){
            return console.log(error);
        }
    console.log(data);
    var randomFile = data.split(",");
    var randomArg1=randomFile[0];
    var randomArg2=randomFile[1];

    var spotify = new spotifyReq(keysFile.spotify);
    spotify.search({ type: 'track', query: randomArg2}, function(error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
//artist, song, preview link, album
        console.log("The requested song is by " + data.tracks.items[0].artists[0].name);
        console.log("The song is "+ data.tracks.items[0].name);
        console.log("You can sample this song at " + data.tracks.items[0].preview_url);
        console.log("This song is on the album " + data.tracks.items[0].album.name);
    });
    });
}

