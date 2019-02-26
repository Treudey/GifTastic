var buttonArray = ["cat", "dog", "hamster"];
var numOfGIFs;

function creatGifButton(id) {
    $("<button>").attr("data-animal", id)
    .text(id)
    .appendTo("#animal-buttons")
    .addClass("gif-button");
}

function createGIFs(results, startPosition, loopLength) {
    for (var i = startPosition; i < loopLength; i++) {   
        var $animalDiv = $("<div>");
        $("<p>").text(results[i].title)
            .addClass("gif-text")
            .appendTo($animalDiv);
        $("<p>").text("rating: " + results[i].rating.toUpperCase())
            .addClass("gif-text")
            .appendTo($animalDiv);
        $("<p>").text("score: " + Math.round(results[i]._score / 30000) + "%")
            .addClass("gif-text")
            .appendTo($animalDiv);
        var $animalImage = $("<img>");
        $animalImage.attr("src", results[i].images.fixed_height_still.url)
            .attr("data-still", results[i].images.fixed_height_still.url)
            .attr("data-animate", results[i].images.fixed_height.url)
            .attr("data-state", "still")
            .addClass("gif");
        $animalDiv.append($animalImage);
        $animalDiv.addClass("animal-div");
        $("#gifs-appear-here").prepend($animalDiv);
    }

}

$(document).ready(function() {

    for (var i = 0; i < buttonArray.length; i++) {
        var animal = buttonArray[i];
        creatGifButton(animal);
    }

    // This function handles events where one button is clicked
    $("#add-button").on("click", function() {
        event.preventDefault();

        var newAnimal = $("#button-input").val().trim();
        if (newAnimal !== "") {
            creatGifButton(newAnimal);
            $("#button-input").val("");
        }

    });
    
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
                    .insertBefore("#gifs-appear-here");
            } else {
                $("#more-gifs").attr("data-animal", animal)
                    .text("more " + animal + " GIFs!");
            }
            numOfGIFs = 10;
        });
    });
    
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


    $(document).on("click", "#more-gifs", function() {
        
        var animal = $(this).attr("data-animal");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            animal + "&api_key=H6XLihFQc94nVJy5yjeqGcZOlNLBd7xf&limit=" + (numOfGIFs + 10);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var results = response.data
    
            createGIFs(results, numOfGIFs, numOfGIFs + 10);
            numOfGIFs += 10;
        });
        
    });
});
