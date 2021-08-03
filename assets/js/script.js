// IMPORTANT: SET THE CORRESPONDING API KEY HERE AS A STRING TO USE THE APPLICATION
var ticketmasterApi;
var googleApi;
var lastFmApi = "84c7b0a48da18ecc54010deb6d0668a3";
var tasteDiveApi;

// variable that will be used to search the api's set when the search button is pressed further down
var artistName = localStorage.getItem("artist");

var getConcertData = function(artistName) {
    $(".orbit-container").html("");

    $.ajax({
        type:"GET",
        url:"https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistName + "&size=4&apikey=" + ticketmasterApi,
        async:true,
        dataType: "json",
        success: function(json) {
            // checks to see if there are any events and if not displays that there are no events for the listed artist
            if (json.page.totalElements > 0) {
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
                    $(anchorEl).attr("target", "_blank");

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
            } else {
                console.log("no events");
                $(".orbit").html("<h1>There are no events for that Artist<h1>")
            }
                         

            
        },
        error: function(xhr, status, err) {
                    console.log(xhr);
                    console.log(status);
                    console.log(err);
                    console.log("there is an error");
                }
        });
};

// IMPORTANT: THIS IS WHERE YOU CAN SET FUNCTIONS TO WORK ON PAGE LOAD 
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
    
    // checks to see what value is selected with the form and sets the corresponding boolean to true and the other ones to false
    if ($("#select :selected").val() === 'artist') {
        var isArtist = true;
        var isSong = false;
        var isAlbum = false;
    } else if ($('#select :selected').val() === 'song') {
        isArtist = false;
        isSong = true;
        isAlbum = false;
    } else if ($("#select :selected").val() === 'album') {
        isArtist = false;
        isSong = false;
        isAlbum = true;
    }

    // console.log("isArtist = " + isArtist);
    // console.log("isSong = " + isSong);
    // console.log("isAlbum = " + isAlbum);

    // IMPORTANT: ALL DATA SHOULD BE DISPLAYED THROUGH THIS FUNCTION UNDERNEATH THE CORRESPONDING FETCH REQUEST
    // the user searches for an artist it will dynamically display the concert data
    if (isArtist) {
        artistName = keyword;
        localStorage.setItem("artist", artistName);
        getConcertData(artistName);
    } else if (isSong) {
        // if the user searches for a song it will find the artist information and display concerts
        var songTitle = keyword;
        fetch("https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + songTitle + "&api_key=" + lastFmApi + "&format=json")
            .then(function(response) {
                response.json().then(function(data) {
                    artistName = data.results.trackmatches.track[0].artist;
                    localStorage.setItem("artist", artistName);
                    getConcertData(artistName);
                })
        })
    } else if (isAlbum) {
        // if the user searches for an album it will find the artist information and display concerts
        var albumName = keyword;
        fetch("https://ws.audioscrobbler.com/2.0/?method=album.search&album=" + albumName + "&api_key=" + lastFmApi + "&format=json")
            .then(function(response) {
                response.json().then(function(data) {
                    artistName = data.results.albummatches.album[0].artist;
                    localStorage.setItem("artist", artistName);
                    getConcertData(artistName);
                })
            })
        }
    

    // console.log(artistName + " is the artist.");
    // console.log(songTitle + " is the title.");
    // console.log(lyrics + " are the lyrics.");
    // console.log(genre + " is the genre.")

    // resets the input field
    $("input[name='keyword']").val("");
});


var getYoutubeId = function(artistName) {
    fetch("https://www.googleapis.com/youtube/v3/search?q=" + artistName + "&videoEmbeddable=true&type=video&key=" + googleApi)
        .then(function(response) {
            response.json().then(function(data) {
                // console.log(data);
            })
        })
}

// getYoutubeId(artistName);
