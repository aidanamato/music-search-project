// DOM Elements
var searchFormEl = $("#search-form");
var searchInputEl = $("input[name='keyword']");
var searchSelectEl = $("#select");

// API Keys
var lastFmApi = "84c7b0a48da18ecc54010deb6d0668a3";

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
    generateArtistResponse(searchValue);
  }

  if (searchSelectEl.val() === "song") {
    generateSongResponse(searchValue);
  }
};

var generateArtistResponse = function(artistName) {

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

var generateSongResponse = function(songName) {

  // run fetch request to search tracks with user search query
  fetch("https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + songName + "&api_key=" + lastFmApi + "&format=json")
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          
          console.log(data);

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

var generateAlbumResponse = function() {

};

var generateGenreResponse = function() {

};

// search button event listener
searchFormEl.on("submit", searchButtonHandler);