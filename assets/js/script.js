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
var artistName = localStorage.getItem("artist");
var songTitle;
var lyrics;
var genre;

var getConcertData = function(artistName) {
    $(".orbit-container").html("");

    $.ajax({
        type:"GET",
        url:"https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistName + "&size=4&apikey=" + ticketmasterApi,
        async:true,
        dataType: "json",
        success: function(json) {
            var events = json._embedded.events;
            // console.log(events);

            // iterates through the results for each of the four events returned
            for (var i = 0; i < events.length; i++) {
                // sets the events name for each object in the array
                var eventName = events[i].name;

                // sets the event date and converts it into a moment object for display
                var date = events[i].dates.start.localDate;
                var eventDate = moment(date).format("MMMM Do, YYYY")

                // sets the event time and converts it into a moment object for display
                var time = events[i].dates.start.localTime;
                var eventTime = moment(time, "HH:mm:ss").format("h:mm A")

                // sets the location for the event
                var eventLocation = events[i]._embedded.venues[0].name;

                // sets the variable for the event photo
                var eventPhoto = events[i].images[0].url;

                // sets the url for the event
                var eventUrl = events[i].url;

                // console.log(eventName);
                // console.log(eventDate);
                // console.log(eventTime);
                // console.log(eventLocation);
                
                // creates the list item that holds other data
                var listEl = $("<li>").attr("data-slide", "class");
                $(listEl).addClass("orbit-slide");

                // sets the is-active class to the first list item created
                if (i === 0) {
                    $(listEl).addClass("is-active");
                }

                // creates the figure container to hold the image and caption
                var figureEl = $("<figure>").addClass("orbit-figure");

                // creates the anchor tag to link to ticketmaster
                var anchorEl = $("<a>").attr("href", eventUrl);

                // holds the events image
                var imgEl = $("<img>").addClass("orbit-image");
                $(imgEl).attr("src", eventPhoto);

                // holds the caption for the event
                var captionEl = $("<figcaption>").addClass("orbit-caption");
                $(captionEl).html(eventName + "</br><span>" + eventDate + "</span></br><span>" + eventTime + "</span></br><span>" + eventLocation + "</span>");

                // appends the image and caption to the anchor
                $(anchorEl).append(imgEl);
                $(anchorEl).append(captionEl);

                // appends the anchor to the figure container
                $(figureEl).append(anchorEl);

                // appends the figure container to the list item
                $(listEl).append(figureEl);

                // appends the list item to the orbit container
                $(".orbit-container").append(listEl);
                
                // reinitializes the orbit instance to update it
                Foundation.reInit($(".orbit"));
            }
        },
        error: function(xhr, status, err) {
                    console.log(xhr);
                    console.log(status);
                    console.log(err);
                }
        });
};

getConcertData(artistName);

// jQuery for the ticketmaster Orbit
$(document).foundation();

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
        localStorage.setItem("artist", artistName);
    } else if (isSong) {
        songTitle = keyword;
        localStorage.setItem("song", songTitle);
    } else if (isLyrics) {
        lyrics = keyword;
        localStorage.setItem("lyrics", lyrics);
    } else if (isGenre) {
        genre = keyword;
        localStorage.setItem("genre", genre);
    }

    // console.log(artistName + " is the artist.");
    // console.log(songTitle + " is the title.");
    // console.log(lyrics + " are the lyrics.");
    // console.log(genre + " is the genre.")

    getConcertData(artistName);
});



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