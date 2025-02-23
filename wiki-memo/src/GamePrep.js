import SmartCrop from "smartcrop";

function getRandIndex(arr) {
    return Math.floor(Math.random() * arr.length)
  }
  
function drawRandomCards(cards) {
    let drawnCards = []
    let drawnUrls = []
    if (cards.length < 12) {
      drawnCards = cards
    } else {
      while(drawnCards.length < 12) {
        let card = {}
        const randIndex = getRandIndex(cards)
        card = cards[randIndex]
        // avoid dulicates
        if (!drawnUrls.includes(card.link)) {
          drawnCards.push(card)
          drawnUrls.push(card.link)
        }
      }
    } 
    return drawnCards
}
  
function createDummyImg(title,color) {
  
    const letters = title.replace(/\s/g,'').slice(0,2)
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
    //const colors = ["#FFCCCC","#FFE5CC","#FFFFCC","#E5FFCC","#CCFFCC","#CCFFE5","#CCFFFF","#CCE5FF","#CCCCFF","#E5CCFF","#FFCCE5"]
    const colors = ["#000000","#00008B","#A52A2A","#D2691E","#006400","#8B008B","#2F4F4F","#FFD700","#4B0082","#C71585","#4682B4","#9ACD32"]
    let i = 0
    const newArray = arr.map((d)=> {
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

async function smartcropImages(arr) {
  
  const croppedImages = Promise.all(arr.map(async d => {
    const imageElement = new Image();
    imageElement.crossOrigin = "Anonymous";
    imageElement.src = d.img_url
    await imageElement.decode()
    const minSize = Math.min([imageElement.height, imageElement.width])
    const canvas = document.createElement("canvas")
    const context = canvas.getContext('2d');
    const crop = await SmartCrop.crop(imageElement,{width: minSize, height: minSize})//.topCrop
    const topCrop = crop.topCrop
    canvas.width = topCrop.width
    canvas.height = topCrop.height
    context.drawImage(imageElement, topCrop.x, topCrop.y, topCrop.width, topCrop.height, 0, 0, canvas.width, canvas.height);
    
    // return cropValue
    return {
      ...d,
      imageCropped: canvas.toDataURL(),
    }
  }))
  return croppedImages
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

export async function prepareCardDeck(array,shuffled=true) {
    const randomCards = drawRandomCards(array)
    const cardsWithDummys = insertDummyImages(randomCards)
    const cropedImages = await smartcropImages(cardsWithDummys)
    const duplicatedCards = duplicateCardStack(cropedImages)
    if (shuffled) {
        return shuffleCardStack(duplicatedCards)
    } else {
       return duplicatedCards
    }
}

