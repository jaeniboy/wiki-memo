import {useState, useEffect} from "react";
import { Github } from 'react-bootstrap-icons';
//import cardData from "./full-data-good-articles.json";
//import cardData from "./wikipedia-data-flat-no-subcats.json";
//import cardData from "./wikipedia-data-flat-no-cats.json";
//import cardData from "./wikipedia-data-flat.json";
//import cardData from "./staedel-data-flat.json";
import cardData from "./wikimedia-commons-data-flat.json"
import {Settings, Disclaimer} from "./Settings.js"
import {prepareCardDeck} from "./GamePrep.js"
import {Board, Card, InfoOnPair} from "./GameComponents.js"
import {End} from "./End.js"
import {Showall} from "./Showall.js"

//import cardData from "./av.json";

//To-Do:
// write settings file
// enable multiple categories
// write readme.md
// add github logo and link
// Startpage to choose different main Stacks (Excellent and good Articles, Child Safe Version, Gemälde)

function App() {

  let cardStack = []
  const [cards, setCards] = useState(cardStack)
  const cardsFlipped = cards.filter((d)=> {return d.position === "faceUp"})
  const numCardsFlipped = cardsFlipped.length
  const remainingCards = cards.filter(d=>d.onBoard).length
  const images = cards.map(d=>d.img_url)
  const [gamePhase, setGamePhase] = useState("setup") // setup, flipping, pair, end, showall
  const [numMoves, setNumMoves] = useState(0)

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  // preload images
  for (const image of images) {
    const imageElement = new Image();
    imageElement.src = image;
  }

  const startGame = (e) => {
    // create card stack base on user input
    e.preventDefault()
    let sel = []
    const value = e.target[0].value

    if (value.includes("subcat-")) {
      const subcatName = value.match(/subcat-(.*)/)[1]
      sel = cardData.filter(d=>d.subcategory===subcatName)
    } else if (value.includes("cat-")) {
      const catName = value.match(/cat-(.*)/)[1]
      sel = cardData.filter(d=>d.category===catName)
    } else {
      sel = cardData;
    }

    cardStack = prepareCardDeck(sel, true)
    setCards(cardStack)
    setGamePhase("disclaimer")
    //setGamePhase("flipping")
    //setGamePhase("end")
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
    setNumMoves(numMoves + 0.5)
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
          <Settings handleSubmit={startGame} cardData={cardData}/>    
        </Flexbox>
      }
      {gamePhase === "disclaimer" &&
      <Flexbox>
        <Disclaimer 
          handleAccept={()=>setGamePhase("flipping")}
          handleQuit={()=>setGamePhase("setup")}
        />
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
          <End 
            handleClick={restartGame}
            numMoves={numMoves}
            handleShowCards={()=>setGamePhase("showall")}
          />
        </Flexbox>
      }
      {gamePhase === "showall" &&
        <Showall 
          cards={cards}
          handleClick={restartGame}
        />
      }
      <a className="github-link" href="https://github.com/jaeniboy/wiki-memo" target="_blank" rel="noreferrer" title="show code on github">
          <Github className="" size={20} color={"whitesmoke"}/>
      </a>
    </>
  );
}

function Flexbox ({children}) {
  return (
    <div className="d-flex justify-content-center vh-100 align-items-center">
      <div className="d-flex flex-column w-50">
      {children}
      </div>
    </div>
  )
}

export default App;
