import {useState} from "react";
import cardData from "./full-data-good-articles.json";
import {Settings} from "./Settings.js"
import {prepareCardDeck} from "./GamePrep.js"
import {Board, Card, InfoOnPair} from "./GameComponents.js"
import {End} from "./End.js"

//import cardData from "./av.json";

//To-Do: 
// Bugfix Alle Kategorien: Zufallsauswahl scheint nicht bis zu den Artikel vorzudringen
// Feature Portrait-Ausrichtung des Spielfeldes
// Refactoring Board und Funktionen auslagern

//const cardSelection = drawRandomCards(cardData)

// function getRandIndex(arr) {
//   return Math.floor(Math.random() * arr.length)
// }

// function drawRandomCards(cards) {
//   let drawnCards = []
//   let drawnUrls = []
//   if (cards.length > 12) {
//     while(drawnCards.length < 12) {
//       let card = {}
//       const randIndex = getRandIndex(cards)
//       if (cards[randIndex].hasOwnProperty("subcategories")) { // it's a category
//         const secondRand = getRandIndex(cards[randIndex].subcategories)
//         const randSubcat = cards[randIndex].subcategories[secondRand]
//         const thirdRand = getRandIndex(randSubcat.subcat_articles)
//         card = randSubcat.subcat_articles[thirdRand]
//       } else if (cards[randIndex].hasOwnProperty("subcat_articles")) { // it's a subcategory
//         const secondRand = getRandIndex(cards[randIndex].subcat_articles)
//         card = cards[randIndex].subcat_articles[secondRand]
//       } else { // it's a article
//         card = cards[randIndex]
//       }
//       // avoid dulicated cards
//       if (!drawnUrls.includes(card.link)) {
//         drawnCards.push(card)
//         drawnUrls.push(card.link)
//       }
//     }
//   } else {
//     drawnCards = cards
//   }
//   return drawnCards
// }

// function createDummyImg(title,color) {

//   const letters = title.slice(0,2)
//   let canvas = document.createElement("canvas")
//   canvas.height = 500
//   canvas.width = 500
  
//   let ctx = canvas.getContext("2d")
//   ctx.fillStyle = color
//   ctx.fillRect(0,0,500,500)
//   ctx.font = "300px Arial"
//   ctx.fillStyle = "#fff";
//   ctx.textBaseline = "middle"; 
//   ctx.textAlign = "center"; 
//   ctx.fillText(letters,250,250)
  
//   return canvas.toDataURL()
// }

// function insertDummyImages(arr) {
//   const colors = ["#FFCCCC","#FFE5CC","#FFFFCC","#E5FFCC","#CCFFCC","#CCFFE5","#CCFFFF","#CCE5FF","#CCCCFF","#E5CCFF","#FFCCE5"]
//   let i = 0
//   let url = "https://atlas-content-cdn.pixelsquid.com/stock-images/crash-test-dummy-head-EKq9qNA-600.jpg"
//   const newArray = arr.map((d)=> {
//     console.log(d)
//     if (!d.img_url || d.img_url === "") {
//       let url = createDummyImg(d.title,colors[i])
//       i++
//       return (
//         {...d,img_url:url}
//       )
//     } else {
//       return d
//     }
//   })
//   return newArray
// }

// function duplicateCardStack(arr) {
//   // duplicate card stack an establish pair reference
//   const initialArray = arr.map(d => {return {...d, pair:d.link, onBoard: true}})
//   const siblings = initialArray.slice().map(d => {return {...d,id: d.id + "-2"}})
//   const newArray = initialArray.concat(siblings)
//   return newArray
// }

// function shuffleCardStack(array) { //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//   for (var i = array.length - 1; i > 0; i--) {
//       var j = Math.floor(Math.random() * (i + 1));
//       var temp = array[i];
//       array[i] = array[j];
//       array[j] = temp;
//   }
//   return array
// }

function App() {

  let cardStack = []
  const [cards, setCards] = useState(cardStack)
  const cardsFlipped = cards.filter((d)=> {return d.position === "faceUp"})
  const numCardsFlipped = cardsFlipped.length
  const remainingCards = cards.filter(d=>d.onBoard).length
  const [gamePhase, setGamePhase] = useState("setup") // setup, flipping, pair, end

  const startGame = (e) => {
    // create card stack base on user input
    e.preventDefault()
    let sel = []
    const value = e.target[0].value
    const idValues = [...value.matchAll(/[\d]+/g)]

    if (value.includes("subcat-")) { // use data from subcategory
        sel = cardData[idValues[0]-1]
        .subcategories
        .filter(d=>d.id===Number(idValues[1]))[0]
        .subcat_articles
    } else if (value.includes("cat-")) { // use data from category
        sel = cardData[idValues[0]-1].subcategories
    } else { // use all data
        sel = cardData;
    }

    // const randomCards = drawRandomCards(sel)
    // const cardsWithDummys = insertDummyImages(randomCards)
    // const duplicatedCards = duplicateCardStack(cardsWithDummys)
    // const shuffledCards = shuffleCardStack(duplicatedCards)
    // //cardStack = duplicatedCards 
    // cardStack = shuffledCards
    cardStack = prepareCardDeck(sel, false)
    setCards(cardStack)
    setGamePhase("flipping")
  
  }

  if (numCardsFlipped === 2) {
    if (cardsFlipped[0].pair === cardsFlipped[1].pair) {
      setTimeout(()=>setGamePhase("pair"),100) 
    } else {
      const allCardsDown = cards.map((d) => {return {...d, position: "faceDown"}})
      setTimeout(()=>setCards(allCardsDown),1000) 
    }
  }
  
  const flipCard = (id) => {
    const newCards = cards.slice().map((d) => {
      if (d.id === id) {
        return {...d, position: "faceUp"}
      } else {
        return d
      }
    })
    setCards(newCards)  
  }

  const removePair = () => {
    const pairRemoved = cards.map((d)=> {
      if (d.position === "faceUp") {
        return {...d, onBoard: false, position: "faceDown"}
      } else {
        return d
      }
    })
    setCards(pairRemoved)
    console.log("Lenght: "+remainingCards)

    if (remainingCards === 2) {
      setGamePhase("end")
    } else {
      setGamePhase("flipping")
    }
  }

  const restartGame = () =>{
    setGamePhase("setup")
  }

  const cardItems = cards.map(d => {

    return <Card 
      key={d.id}
      data = {d}
      handleFlip={()=> numCardsFlipped!==2 && flipCard(d.id)}
      />
  })

  return (
    <>
      {gamePhase === "setup" &&
        <Flexbox>
          <Settings handleSubmit={startGame}/>      
        </Flexbox>
      }
      {gamePhase === "pair" &&
        <InfoOnPair handleRemovePair={()=>removePair()} flippedCard={cardsFlipped[0]}/>      
      }
      {(gamePhase === "flipping" || gamePhase === "pair") &&
        <Board>
          {cardItems}
        </Board>
      }
      {gamePhase === "end" &&
        <Flexbox>
          <End handleClick={restartGame}/>
        </Flexbox>
      }
    </>
  );
}

function Flexbox ({children}) {
  return (
    <div className="d-flex justify-content-center vh-100 align-items-center">
      <div className="d-flex flex-column">
      {children}
      </div>
    </div>
  )
}

export default App;
