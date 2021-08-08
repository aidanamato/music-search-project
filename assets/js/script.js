// DOM Elements
var searchFormEl = $("#search-form");
var searchInputEl = $("input[name='keyword']");
var searchSelectEl = $("#select");

// API Keys
var lastFmApi = "84c7b0a48da18ecc54010deb6d0668a3";
var ticketmasterApi= "YYRv4qLA9UqXh2zNJFQwAPAZvyClko52";
var googleApi = "AIzaSyBP7ovZKF0a2TlcfdFLzD0UcxXrGEXcRw8";
var tastediveApi;

var searchButtonHandler = function(event) {
  event.preventDefault();

  // remove previous response element
  var artistResponseEl = $("#form-response");
  if (artistResponseEl) {
    artistResponseEl.remove();
  }

  // variable holding user search query
  var searchValue = searchInputEl.val();

  // if user searches artist
  if (searchSelectEl.val() === "artist") {
    artistSearchHandler(searchValue);
  }

  // if user searches song
  if (searchSelectEl.val() === "song") {
    songSearchHandler(searchValue);
  }

  // if user searches album
  if (searchSelectEl.val() === "album") {
    albumSearchHandler(searchValue);
  }
};

// search handler functions
var artistSearchHandler = function(artistName) {
  // run fetch request to search artist names with user search query
  fetch("https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + artistName + "&api_key=" + lastFmApi + "&format=json")
    .then(function(response) {
      if(response.ok) {
        response.json().then(function(data) {
          // get the artist name of first search result
          artistName = data.results.artistmatches.artist[0].name;

          // run fetch requests for artist name, track list, and album art of first track
          fetch("https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + artistName + "&api_key=" + lastFmApi + "&format=json")
            .then(function(response) {
              if(response.ok) {
                response.json().then(function(data) {
                  
                  // verify artist name
                  artistName = data.toptracks['@attr'].artist;

                  // create array to hold top 5 tracks
                  var trackList = [];

                  // add 5 songs to trackList array
                  for (var i = 0; i < 5; i++) {
                    var artistTrack = data.toptracks.track[i].name;
                    trackList.push(artistTrack);
                  }

                  // run fetch request for album image of first song in trackList array
                  fetch("https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + lastFmApi + "&artist=" + artistName + "&track=" + trackList[0] + "&format=json")
                    .then(function(response) {
                      if(response.ok) {
                        response.json().then(function(data) {
                          
                          // retrieve album title and image
                          var albumName = data.track.album.title;
                          var albumImg = data.track.album.image[3]["#text"];

                          // create artist response element
                          artistResponseEl = $("<section id='form-response' class='form-response'>");

                          artistResponseEl.html("<div class='search-response grid-x'><div class='response-top cell'><div class='grid-x'><div class='title-container cell small-7'><h2 class='response-title'>" + artistName + "</h2></div><div class='cell small-5'><img class='album-img' src='" + albumImg + "' alt='The album art for " + albumName + ".'/></div></div></div><div class='cell'><h3>Top Tracks</h3><ol class='track-list'><li>" + trackList[0] + "</li><li>" + trackList[1] + "</li><li>" + trackList[2] + "</li><li>" + trackList[3] + "</li><li>" + trackList[4] + "</li></ol></div></div>");

                          searchFormEl.after(artistResponseEl);

                          // call youtube and carousel functions
                          displayYoutubePlayerEl(trackList[0]);
                          displayEventCarouselEl(artistName);
                        });
                      } else {
                        console.log("Last.fm request not okay");
                      }
                    });
                  });
              } else {
                console.log("Last.fm request not okay");
              }
            });
        });
      } else {
        console.log("Last.fm request not okay")
      }
    });
};

var songSearchHandler = function(songName) {
  // run fetch request to search tracks with user search query
  fetch("https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + songName + "&api_key=" + lastFmApi + "&format=json")
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          // get song title and artist name of first response
          songName = data.results.trackmatches.track[0].name;
          var artistName = data.results.trackmatches.track[0].artist;

          // get album art of song
          fetch("https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + lastFmApi + "&artist=" + artistName + "&track=" + songName + "&format=json")
            .then(function(response) {
              if (response.ok) {
                response.json().then(function(data) {
                  
                  // retrieve album title and image
                  var albumName = data.track.album.title;
                  var albumImg = data.track.album.image[3]["#text"];

                  // create artist response element
                  songResponseEl = $("<section id='form-response' class='form-response'>");

                  songResponseEl.html("<div class='search-response grid-x'><div class='title-container song-container cell small-7'><h2 class='response-title'>" + songName + "</h2><h3 class='response-subtitle'>" + artistName + "</h3><h3 class='album-name'>" + albumName + "</h3></div><div class='cell small-5'><img class='album-img' src='" + albumImg + "' alt='The album art for " + albumName + ".'/></div></div>");

                  searchFormEl.after(songResponseEl);

                  // call youtube and carousel functions
                  displayYoutubePlayerEl(songName);
                  displayEventCarouselEl(artistName);
                });
              } else {
                console.log("Last.fm request not okay");
              }
            });
        })
      } else {
        console.log("Last.fm request not okay");
      }
    });
};

var albumSearchHandler = function(albumName) {
  // run fetch request to search albums with user search query
  fetch("https://ws.audioscrobbler.com/2.0/?method=album.search&album=" + albumName + "&api_key=" + lastFmApi + "&format=json")
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          // run fetch request to get album data of first result
          var albumName = data.results.albummatches.album[0].name;
          var artistName = data.results.albummatches.album[0].artist;
          fetch("https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + lastFmApi + "&artist=" + artistName + "&album=" + albumName + "&format=json")
            .then(function(response) {
              if (response.ok)  {
                response.json().then(function(data) {
                  // retrieve remaining album data
                  var albumImg = data.album.image[3]["#text"];
                  // create array for track list
                  var trackList = [];
                  for (var i = 0; i < data.album.tracks.track.length; i++) {
                    trackList.push(data.album.tracks.track[i].name);
                  }

                  // create album response element
                  albumResponseEl = $("<section id='form-response' class='form-response'>");

                  albumResponseEl.html("<div class='search-response grid-x'><div class='response-top cell'><div class='grid-x'><div class='title-container cell small-7'><h2 class='response-title'>" + albumName + "</h2><h3 class='response-subtitle'>" + artistName + "</h3></div><div class='cell small-5'><img class='album-img' src='" + albumImg + "' alt='The album art for the album.'/></div></div></div><ol class='track-list cell'></ol></div>");

                  searchFormEl.after(albumResponseEl);

                  trackListEl = $(".track-list");
                  console.log(trackListEl);

                  // append track names to track list element
                  for (var i = 0; i < trackList.length; i++) {
                    trackListEl.append("<li>"+ trackList[i] + "</li>");
                  }

                  // call youtube and carousel functions
                  displayYoutubePlayerEl(trackList[0]);
                  displayEventCarouselEl(artistName);
                });
              } else {
                console.log("Last.fm request not okay");
              }
            });
        });
      } else {
        console.log("Last.fm request not okay");
      }
    });
};

var genreSearchHandler = function() {

};

// Youtube Player
var displayYoutubePlayerEl = function(searchTerm) {
  // get YT ID
  fetch("https://www.googleapis.com/youtube/v3/search?q=" + searchTerm + "&videoEmbeddable=true&type=video&key=" + googleApi)
        .then(function(response) {
            if (response.ok) {
              response.json().then(function(data) {
                var youtubeId = data.items[0].id.videoId;

                var videoContainerEl = $("<div>").addClass("video-container");
                videoContainerEl.html("<h2 id='song-title' style='text-align: center;'>" + searchTerm +"</h2><div class='video-player-container'><div id='ytplayer'><iframe width='560' height='400' src='https://www.youtube.com/embed/" + youtubeId + "' title='Youtube video player frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></div></div>")

                $("#form-response").append(videoContainerEl);
              });
            } else {
              console.log("YouTube call was not okay");
            }
        })
};

// Ticketmaster Carousel
$(document).foundation();

var displayEventCarouselEl = function(artistName) {
  $(".orbit-container").html("");
  $(".orbit-bullets").html("");

  $.ajax({
      type:"GET",
      url:"https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistName + "&size=4&apikey=" + ticketmasterApi,
      async:true,
      dataType: "json",
      success: function(json) {
          // checks to see if there are any events and if not displays that there are no events for the listed artist
          if (json.page.totalElements > 0) {
              var events = json._embedded.events;
              console.log(events);

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

                  var bulletEl = $("<button>").attr("data-slide", "class");
                  var bulletContainer = $(".orbit-bullets");
                  
                  // creates the list item that holds other data
                  var listEl = $("<li>").attr("data-slide", "class");
                  $(listEl).addClass("orbit-slide");

                  // sets the is-active class to the first list item created
                  if (i === 0) {
                      $(listEl).addClass("is-active");
                      $(bulletEl).addClass("is-active");
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

                  $(bulletContainer).append(bulletEl);

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


// Displays a list of similar artists

var displaySimilarArtists = function(artistName){
    fetch("https://cors-anywhere.herokuapp.comhttps://tastedive.com/api/similar?q=" + artistName + "&k=" + tastediveApi)
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    }) 
};


// search form event listener
searchFormEl.on("submit", searchButtonHandler);
