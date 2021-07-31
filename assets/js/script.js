// variables to hold the api keys 
var ticketmasterApi;
var googleApi;
var lastFmApi;
var tasteDiveApi;

// booleans for each option
var isArtist = false;
var isSong = false;
var isLyrics = false;
var isGenre = false;

// variable that will be used to search the api's set when the search button is pressed further down
var artistName;
var songTitle;
var lyrics;
var genre;

// logic for the search form
$("#search").on("click", function() {
    // stores the keyword value in a variable for future use
    var keyword = $("input[name='keyword']").val();

    // resets the variables upon button press
    artistName = "";
    songTitle = "";
    lyrics = "";
    genre = "";
    
    // checks to see what value is selected with the form and sets the corresponding boolean to true and the other ones to false
    if ($("#select :selected").val() === 'artist') {
        isArtist = true;
        isSong = false;
        isLyrics = false;
        isGenre = false;
    } else if ($('#select :selected').val() === 'song') {
        isArtist = false;
        isSong = true;
        isLyrics = false;
        isGenre = false;
    } else if ($('#select :selected').val() === 'lyrics') {
        isArtist = false;
        isSong = false;
        isLyrics = true;
        isGenre = false;
    } else if ($("#select :selected").val() === 'genre') {
        isArtist = false;
        isSong = false;
        isLyrics = false;
        isGenre = true;
    }

    // console.log("isArtist = " + isArtist);
    // console.log("isSong = " + isSong);
    // console.log("isLyrics = " + isLyrics);
    // console.log("isGenre = " + isGenre);

    // logic for setting the variables that will be used for api's and further functionality
    if (isArtist) {
        artistName = keyword;
    } else if (isSong) {
        songTitle = keyword;
    } else if (isLyrics) {
        lyrics = keyword;
    } else if (isGenre) {
        genre = keyword;
    }

    // console.log(artistName + " is the artist.");
    // console.log(songTitle + " is the title.");
    // console.log(lyrics + " are the lyrics.");
    // console.log(genre + " is the genre.")
});

// jQuery for the ticketmaster Orbit
$(document).ready(function() {
    $(document).foundation();
 })

//  logic for youtube api
// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: '93uEGbM4gt4'
    });
}