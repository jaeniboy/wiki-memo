# wiki-memo
Small memory game based on react.js and - in its original form - on a dataset built from the german Wikipedia's ["good articles" page](https://de.wikipedia.org/wiki/Wikipedia:Lesenswerte_Artikel). 

The project was mainly established to learn the react.js framework but it's additionaly a (hopefully) entertaining approach to extend one's knowledge. It is designed to be a flexible container, allowing you to easily integrate other datasets with the same structure. 

## Usage

The dataset should describe all available cards using the following structure:

    [
        {
            "id":           // unique integer
            "title":        // string, the cards title
            "summary":      // string, additional information about the subject
            "img_url":      // url, link to the cards image
            "category":     // string, the main category, the card belongs to, leave empty if not given
            "subcategory":  // string, a additional subcategory, leave empty if not given
        }, ...
    ]