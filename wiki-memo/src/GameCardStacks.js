import goodArticles from "./excellent-articles-flat.json";
import pictures from "./wikimedia-commons-data-flat.json";
import paintings from "./wikipedia-paintings-flat.json";

export const previewData = [
    {
        "title":"Exzellente Artikel",
        "description":'Artikel, die im April 2024 in der deutschsprachigen Wikipedia als "exzellent" markiert waren',
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Orion_Nebula_%28M42%29_part_HST_4800px.jpg/2000px-Orion_Nebula_%28M42%29_part_HST_4800px.jpg",
        "mainStack" : goodArticles,
        "disclaimer":'Some content may appear within the game that users may find inappropriate or disturbing - such as war crimes, genocides, sexual content, etc. This is because the dataset was built from specific Wikipedia articles that were marked as "good" by the German Wikipedia community. I decided to leave all topics untouched so that each user can decide whether he or she wants to learn more about them or not. If you feel uncomfortable with these things, please do not play the game.'
    },
    {
        "title":"Exzellente Bilder",
        "description":'Eine Auswahl besonders hochwertiger Bilder auf Wikimedia Commons (child safe)',
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Eisvogel_kingfisher.jpg/640px-Eisvogel_kingfisher.jpg",
        "mainStack" : pictures,
        "disclaimer":""
    },
    {
        "title":"Gemälde aus fünf Jahrhunderten",
        "description":'Artikel aus der Kategorie "Gemälde" vom 15. bis zum 19. Jahrhundert',
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Goethe_in_the_Roman_Campagna_%28SM_1157%29.png/1024px-Goethe_in_the_Roman_Campagna_%28SM_1157%29.png",
        "mainStack" : paintings,
        "disclaimer":"Vorsicht, hier können auch mal Nackideis dabei sein"
    }
  ]
  