/* VARIABLES
******************************* */
// Holds the starting animals we want to turn into buttons once the page loads
var buttonArray = ["cat", "dog", "hamster", "penguin", "hedgehog", "mouse", "guinea pig", "bunny", "goat"];
// Will be an integer that we will use to say how many GIFs we want to use when we call the Giphy API
var numOfGIFs;
// Used to store an array of numbers to indentify the saved GIFs
var favNumArray = JSON.parse(localStorage.getItem("favNumArray"));


/* FUNCTIONS
*******************************************************/
// Creates the buttons with whatever animal name is given
function creatGifButton(id) {
    $("<button>").attr("data-animal", id)
    .text(id)
    .appendTo("#animal-buttons")
    .addClass("gif-button");
}

// Creates GIFS when given the JSON object from the AJAX call
function createGIFs(results, startPosition, loopLength) {
    for (var i = startPosition; i < loopLength; i++) {   
        var $animalDiv = $("<div>");
        $animalDiv.addClass("animal-div")
            .attr("id", "gif" + i);
        $("<p>").text(results[i].title)
            .addClass("gif-text")
            .attr("id", "gif" + i + "title")
            .appendTo($animalDiv);
        $("<p>").text("rating: " + results[i].rating.toUpperCase())
            .addClass("gif-text")
            .attr("id", "gif" + i + "rating")
            .appendTo($animalDiv);
        $("<p>").text("score: " + Math.round(results[i]._score))
            .addClass("gif-text")
            .attr("id", "gif" + i + "score")
            .appendTo($animalDiv);
        var $animalImage = $("<img>");
        $animalImage.attr("src", results[i].images.fixed_height_still.url)
            .attr("data-still", results[i].images.fixed_height_still.url)
            .attr("data-animate", results[i].images.fixed_height.url)
            .attr("data-state", "still")
            .attr("id", "gif" + i + "img")
            .addClass("gif");
        $animalDiv.append($animalImage);
        $('<p>download GIF</p>').addClass("link")
            .appendTo($animalDiv);
        $('<p>add to favourites</p>').addClass("add-favourite")
            .appendTo($animalDiv);
        $("#gifs-appear-here").prepend($animalDiv);
    }
}

// This function that creates a GIF from localStorage to display 
// in the 'favourites section' when given a single identifying number
function createFavGIF(num) {
    var $animalDiv = $("<div>");
    $animalDiv.addClass("animal-div")
        .attr("id", num);
    $("<p>").text(localStorage.getItem("title" + num))
        .addClass("gif-text")
        .attr("id", num + "title")
        .appendTo($animalDiv);
    $("<p>").text(localStorage.getItem("rating" + num))
        .addClass("gif-text")
        .appendTo($animalDiv);
    $("<p>").text(localStorage.getItem("score" + num))
        .addClass("gif-text")
        .appendTo($animalDiv);
    var $animalImage = $("<img>");
    $animalImage.attr("src", localStorage.getItem("gifStill" + num))
        .attr("data-still", localStorage.getItem("gifStill" + num))
        .attr("data-animate", localStorage.getItem("gifAnimate" + num))
        .attr("data-state", "still")
        .attr("id", num + "img")
        .addClass("gif");
    $animalDiv.append($animalImage);
    $('<p>download GIF</p>').addClass("link")
        .appendTo($animalDiv);
    $('<p>remove from favourites</p>').addClass("remove-favourite")
        .appendTo($animalDiv);
    $("#favourites").append($animalDiv);
}

// Creates a temporary <a> tag to download
function forceDownload(blob, filename) {
  var a = document.createElement('a');
  a.download = filename;
  a.href = blob;
  // For Firefox 
  document.body.appendChild(a);
  a.click();
  a.remove();
}
  
// Creates blob and a filename for download for browsers
function downloadResource(url, filename) {
    if (!filename) {
        filename = url.split('\\').pop().split('/').pop(); 
    }
    fetch(url, {
        headers: new Headers({
            'Origin': location.origin
        }),
        mode: 'cors'
        })
        .then(function(response) { return response.blob() })
        .then(function(blob) {
        var blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
        })
        .catch(function(e) { return console.error(e) });
}

/* MAIN PROCESS
******************************************************* */
$(document).ready(function() {
    // If the favNumArray is not stored in LocalStorage it creates a new one to work with
    if (favNumArray === null) {
        favNumArray = [0];
    }

    // Loops through all the numbers in favNumArray except the last one and creates the appropriate GIF 
    for (var i = 0; i < favNumArray.length-1; i++) {
        if (favNumArray[i]) {
            var id = favNumArray[i];
            createFavGIF(id);
        }
    }

    // Creates the initial row of buttons from the buttonArray
    for (var i = 0; i < buttonArray.length; i++) {
        var animal = buttonArray[i];
        creatGifButton(animal);
    }

    // Creates a new button based on what the user enters into the text-input field
    $("#add-button").on("click", function() {
        event.preventDefault();

        var newAnimal = $("#button-input").val().trim();
        if (newAnimal !== "") {
            creatGifButton(newAnimal);
            $("#button-input").val("");
        }
    });
    
    // Handles the click event for the different GIF buttons by taking it's text
    // and using it in an AJAX call to the Giphy API
    $(document).on("click", ".gif-button", function() {

        $("#gifs-appear-here").empty();
    
        var animal = $(this).attr("data-animal");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            animal + "&api_key=H6XLihFQc94nVJy5yjeqGcZOlNLBd7xf&limit=10";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
    
            var results = response.data
    
            createGIFs(results, 0, results.length);

            if (!$("#more-gifs").length) {
                $("<button>").attr("id", "more-gifs")
                    .text("more " + animal + " GIFs!")
                    .attr("data-animal", animal)
                    .insertAfter("form");
                $("<br>").insertAfter("#more-gifs");
            } else {
                $("#more-gifs").attr("data-animal", animal)
                    .text("more " + animal + " GIFs!");
            }
            numOfGIFs = 10;
        });
    });
    
    // Causes the GIF to animate or go still whenever it is clicked
    $(document).on("click", "img", function() {
        var state = $(this).attr("data-state");
        var still = $(this).attr("data-still");
        var animate = $(this).attr("data-animate");
    
        if (state === "still") {
          $(this).attr("src", animate)
            .attr("data-state", "animate");
        } else if (state === "animate") {
          $(this).attr("src", still)
            .attr("data-state", "still");
        }
    });

    // Click event forcreating more GIFS which makes another ajax call and uses 
    // the next 10 GIFS from it
    $(document).on("click", "#more-gifs", function() {
        
        var animal = $(this).attr("data-animal");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            animal + "&api_key=H6XLihFQc94nVJy5yjeqGcZOlNLBd7xf&limit=" + 
            (numOfGIFs + 10);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var results = response.data
    
            createGIFs(results, numOfGIFs, numOfGIFs + 10);
            numOfGIFs += 10;
        });
    });

    // Click event for the download link
    $(document).on("click", ".link", function() {
        var parentID = $(this).parent().attr("id");
        var url = $("#" + parentID + "img").attr("data-animate");
        var name = $("#" + parentID + "title").text();  
        downloadResource(url, name);
    });

    // Takes the associated GIF data and stores it LocalStorage and then
    // displays it in the 'favoruites section', and finally it updates favNumArray
    $(document).on("click", ".add-favourite", function() {
       
        var currentFav = favNumArray[favNumArray.length-1];

        var parentID = $(this).parent().attr("id");
        var title = $("#" + parentID + "title").text();  
        var rating = $("#" + parentID + "rating").text();  
        var score = $("#" + parentID + "score").text();  
        var gifStill = $("#" + parentID + "img").attr("data-still");  
        var gifAnimate = $("#" + parentID + "img").attr("data-animate");
        
        localStorage.setItem("title" + currentFav, title);
        localStorage.setItem("rating" + currentFav, rating);
        localStorage.setItem("score" + currentFav, score);
        localStorage.setItem("gifStill" + currentFav, gifStill);
        localStorage.setItem("gifAnimate" + currentFav, gifAnimate);

        createFavGIF(currentFav);

        favNumArray.push(currentFav + 1);
        localStorage.setItem("favNumArray", JSON.stringify(favNumArray));
    });

    // When clicked we remove associated GIF data from Local Storage and its 
    // id number from the favNumArray as well as remove it visually from the page
    $(document).on("click", ".remove-favourite", function() {
        var parentID = parseInt($(this).parent().attr("id"));
        $(this).parent().remove();
        
        localStorage.removeItem("title" + parentID);
        localStorage.removeItem("rating" + parentID);
        localStorage.removeItem("score" + parentID);
        localStorage.removeItem("gifStill" + parentID);
        localStorage.removeItem("gifAnimate" + parentID);

        delete favNumArray[parentID];
        localStorage.setItem("favNumArray", JSON.stringify(favNumArray));
    });
});