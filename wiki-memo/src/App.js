import {useState, useEffect} from "react";
import { Github } from 'react-bootstrap-icons';
import {previewData} from "./GameCardStacks.js";
import { ShowPreview } from "./GamePreview.js";
import {Settings, Disclaimer} from "./GameSettings.js";
import {prepareCardDeck} from "./GamePrep.js";
import {Board, Card, InfoOnPair} from "./GameComponents.js";
import {End} from "./GameEnd.js";
import {Showall} from "./GameShowAll.js";

//import cardData from "./av.json";

//To-Do:
// ship image cropping to gameprep.js
// write readme.md

function App() {

  let cardStack = []
  const [mainStack, setMainStack] = useState({})
  const [cards, setCards] = useState([])
  const cardsFlipped = cards.filter((d)=> {return d.position === "faceUp"})
  const numCardsFlipped = cardsFlipped.length
  const remainingCards = cards.filter(d=>d.onBoard).length
  const images = cards.map(d=>d.img_url)
  const [gamePhase, setGamePhase] = useState("preview") // preview, setup, flipping, pair, end, showall
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

  const startGame = async (e) => {
    // create card stack based on user input
    e.preventDefault()
    let sel = []
    const value = e.target[0].value

    if (value === "all-cards") {
      sel = mainStack.mainStack;
    } else {
      sel = mainStack.mainStack.filter(d=>d.category.includes(value))
    }

    cardStack = await prepareCardDeck(sel, true)
    setCards(cardStack)
    mainStack.disclaimer !== "" ? setGamePhase("disclaimer") : setGamePhase("flipping")
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

    if (remainingCards === 2) {
      setGamePhase("end")
    } else {
      setGamePhase("flipping")
    }
  }

  const restartGame = () =>{
    setNumMoves(0)
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
      {gamePhase === "preview" &&
      <Flexbox classes="flexbox">
        <ShowPreview handleClick={(index)=>{
            setMainStack(previewData[index])
            setGamePhase("setup")
            }
          } previewData={previewData}/>
      </Flexbox>
      }
      {gamePhase === "setup" &&
        <Flexbox>
          <Settings 
            handleSubmit={startGame} 
            cardData={mainStack.mainStack} 
            handleBacklink={()=>setGamePhase("preview")}
          />    
        </Flexbox>
      }
      {gamePhase === "disclaimer" &&
      <Flexbox classes="w-50">
        <Disclaimer
          text={mainStack.disclaimer}
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
      <a 
        className="github-link" 
        href="https://github.com/jaeniboy/wiki-memo" 
        target="_blank" 
        rel="noreferrer" 
        title="show code on github"
        >
          <Github className="" size={20} color={"whitesmoke"}/>
      </a>
    </>
  );
}

function Flexbox ({children, classes}) {
  return (
    <div className="d-flex justify-content-center vh-100 align-items-center">
      <div className={"d-flex flex-column " + classes}>
      {children}
      </div>
    </div>
  )
}

export default App;
