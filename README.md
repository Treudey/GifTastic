# GifTastic

This application let's you quickly find cute animal GIFs where you can choose from several buttons generating animal GIFs or add your own buttons. You can then download GIFs you like or save them to a `favourites section` which will persist on the site when you refrsh the page or close your browser.

[Click here to go to GifTastic!](https://treudey.github.io/GifTastic)

### Overview

* Several buttons with various animal names are displayed at the top of the page.

* When the user clicks on a button, the page grabs 10 static, non-animated GIF images from the GIPHY API and places them on the page.

* When the user clicks one of the still GIPHY images, the GIF will animate. If the user clicks the GIF again, it will stop playing.

* Above every GIF, its title, its rating (PG, G, so on), and its score is displayed. This data is provided by the GIPHY API.

* There is a form that takes the value from a user input box and creates a button that is added alongside the rest of the buttons on the page.

* Users can request additional gifs to be added to the page by clicking the `more GIFs` button.
   * Each request adds 10 gifs to the page, but doesn't overwrite the existing gifs.

* There is a 1-click download button for each gif, that works across device types.

* Users can add their favourite gifs to a `favourites section`.
   * This persists when they select or add a new topic.
   * This section also persists even when the page is reloaded or the browser restarted (via localStorage).
