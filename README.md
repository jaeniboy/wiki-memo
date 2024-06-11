# wiki-memo
Small memo (aka Pairs) game based on react.js and three datasets built from Wikipedia articles and pictures with free license ([featured articles (de)](https://de.wikipedia.org/wiki/Wikipedia:Exzellente_Artikel), [featured pictures](https://commons.wikimedia.org/wiki/Commons:Featured_pictures), [famous paintings by century (de)](https://de.wikipedia.org/wiki/Kategorie:Gem%C3%A4lde_nach_Jahrhundert)). 

The project was mainly established to learn the react.js framework but it's additionaly a (hopefully) entertaining approach to extend one's knowledge. It is designed to be a flexible container, allowing you to easily integrate other datasets with the same structure. 

## Usage

The dataset should describe all available cards using the following structure:

    [
        {
            "id":               // unique integer
            "title":            // string, the cards title
            "summary":          // string, additional information about the subject
            "img_url":          // url, link to the cards image
            "img_info_url":     // url, link to get more info about the image (i.e. license, author)
            "img_license":      // string, short term of image license
            "img_licence_link:  // url, link to text of image licence
            "img_artist":       // string, name of image artist
            "category":         // array, pne or more category names
            "link":             // url, link to get more information about the card's subject
        }, ...
    ]

To add a new dataset to the game, import it in GameCardStacks.js and present some information as a new object using the following structure:

    [
        {
            "title":        // string, title of the new card stack
            "description":  // string, short description of the card stack
            "image":        // url, link to the preview image
            "mainStack" :   // variable used to import the new dataset
            "disclaimer":   // string, warning if cardstack contains sensible content. Add empty string, if not
        }
    ]