var buttonArray = ["cat", "dog", "hamster"];

function createGIF(id) {
    $("<button>").attr("data-animal", id)
    .text(id)
    .appendTo("#animal-buttons")
    .addClass("gif");
}

// This function handles events where one button is clicked
$("#add-button").on("click", function() {
    event.preventDefault();

    var newAnimal = $("#button-input").val().trim();
    createGIF(newAnimal);
    $("#button-input").val("");
});

$(document).ready(function() {

    for (var i = 0; i < buttonArray.length; i++) {
        var animal = buttonArray[i];
        createGIF(animal);
    }
    
    $(document).on("click", "button", function() {
        $("#gifs-appear-here").empty();
    
        var animal = $(this).attr("data-animal");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            animal + "&api_key=H6XLihFQc94nVJy5yjeqGcZOlNLBd7xf&limit=10";
    
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
    
            var results = response.data
    
            for (var i = 0; i < results.length; i++) {
            
                var $animalDiv = $("<div>");
                var $p = $("<p>");
                $p.text("Rating: " + results[i].rating.toUpperCase());
                var $animalImage = $("<img>");
                $animalImage.attr("src", results[i].images.fixed_height_still.url)
                    .attr("data-still", results[i].images.fixed_height_still.url)
                    .attr("data-animate", results[i].images.fixed_height.url)
                    .attr("data-state", "still");
                $animalDiv.append($p);
                $animalDiv.append($animalImage);
                $("#gifs-appear-here").prepend($animalDiv);
            }
        });
    });
    
    $(document).on("click", "img", function() {
    
        var state = $(this).attr("data-state");
        var still = $(this).attr("data-still");
        var animate = $(this).attr("data-animate");
    
        if (state === "still") {
          $(this).attr("src", animate);
          $(this).attr("data-state", "animate");
        } else if (state === "animate") {
          $(this).attr("src", still);
          $(this).attr("data-state", "still");
        }
        
    });

});
