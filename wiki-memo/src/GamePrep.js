function getRandIndex(arr) {
    return Math.floor(Math.random() * arr.length)
  }
  
function drawRandomCards(cards) {
    let drawnCards = []
    let drawnUrls = []
    if (cards.length > 12) {
      while(drawnCards.length < 12) {
        let card = {}
        const randIndex = getRandIndex(cards)
        if (cards[randIndex].hasOwnProperty("subcategories")) { // it's a category
          const secondRand = getRandIndex(cards[randIndex].subcategories)
          const randSubcat = cards[randIndex].subcategories[secondRand]
          const thirdRand = getRandIndex(randSubcat.subcat_articles)
          card = randSubcat.subcat_articles[thirdRand]
        } else if (cards[randIndex].hasOwnProperty("subcat_articles")) { // it's a subcategory
          const secondRand = getRandIndex(cards[randIndex].subcat_articles)
          card = cards[randIndex].subcat_articles[secondRand]
        } else { // it's a article
          card = cards[randIndex]
        }
        // avoid dulicated cards
        if (!drawnUrls.includes(card.link)) {
          drawnCards.push(card)
          drawnUrls.push(card.link)
        }
      }
    } else {
      drawnCards = cards
    }
    return drawnCards
}
  
function createDummyImg(title,color) {
  
    const letters = title.slice(0,2)
    let canvas = document.createElement("canvas")
    canvas.height = 500
    canvas.width = 500
    
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = color
    ctx.fillRect(0,0,500,500)
    ctx.font = "300px Arial"
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle"; 
    ctx.textAlign = "center"; 
    ctx.fillText(letters,250,250)
    
    return canvas.toDataURL()
}
  
function insertDummyImages(arr) {
    const colors = ["#FFCCCC","#FFE5CC","#FFFFCC","#E5FFCC","#CCFFCC","#CCFFE5","#CCFFFF","#CCE5FF","#CCCCFF","#E5CCFF","#FFCCE5"]
    let i = 0
    let url = "https://atlas-content-cdn.pixelsquid.com/stock-images/crash-test-dummy-head-EKq9qNA-600.jpg"
    const newArray = arr.map((d)=> {
      console.log(d)
      if (!d.img_url || d.img_url === "") {
        let url = createDummyImg(d.title,colors[i])
        i++
        return (
          {...d,img_url:url}
        )
      } else {
        return d
      }
    })
    return newArray
}
  
function duplicateCardStack(arr) {
    // duplicate card stack an establish pair reference
    const initialArray = arr.map(d => {return {...d, pair:d.link, onBoard: true}})
    const siblings = initialArray.slice().map(d => {return {...d,id: d.id + "-2"}})
    const newArray = initialArray.concat(siblings)
    return newArray
}
  
function shuffleCardStack(array) { //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

export function prepareCardDeck(array,shuffled=true) {
    const randomCards = drawRandomCards(array)
    const cardsWithDummys = insertDummyImages(randomCards)
    const duplicatedCards = duplicateCardStack(cardsWithDummys)
    if (shuffled) {
        return shuffleCardStack(duplicatedCards)
    } else {
       return duplicatedCards
    }
}

