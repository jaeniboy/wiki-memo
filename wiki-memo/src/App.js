import {useState} from "react";
import cardData from "./full-data-good-articles.json";
import {Settings} from "./Settings.js"
import {prepareCardDeck} from "./GamePrep.js"
import {Board, Card, InfoOnPair} from "./GameComponents.js"
import {End} from "./End.js"

//import cardData from "./av.json";

//To-Do: 
// Bugfix Alle Kategorien: Zufallsauswahl scheint nicht bis zu den Artikel vorzudringen
// Bugfix Spielfeld bei Portraitausrichtung zentrieren
// Bugfix Margin bei Pair Infopage entfernen
// Schnelleres Laden von Bildern ermöglichen

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

    cardStack = prepareCardDeck(sel, true)
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
