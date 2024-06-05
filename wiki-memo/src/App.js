import {useState} from "react";
import { Github } from 'react-bootstrap-icons';
//import cardData from "./full-data-good-articles.json";
//import cardData from "./wikipedia-data-flat-no-subcats.json";
//import cardData from "./wikipedia-data-flat-no-cats.json";
//import cardData from "./staedel-data-flat.json";
import goodArticles from "./wikipedia-data-flat.json";
import pictures from "./wikimedia-commons-data-flat.json";
import paintings from "./wikipedia-paintings-flat.json";
import { ShowPreview } from "./GamePreview.js";
import {Settings, Disclaimer} from "./GameSettings.js";
import {prepareCardDeck} from "./GamePrep.js";
import {Board, Card, InfoOnPair} from "./GameComponents.js";
import {End} from "./End.js";
import {Showall} from "./Showall.js";

//import cardData from "./av.json";

//To-Do:
// write settings file
// enable multiple categories
// write readme.md
// Startpage to choose different main Stacks (Excellent and good Articles, Child Safe Version, Gemälde)

const previewData = [
  {
      "title":"Lesenswerte Artikel",
      "description":'Artikel, die im April 2024 in der deutschsprachigen Wikipedia als "lesenswert" markiert waren',
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Canal_Grande_Chiesa_della_Salute_e_Dogana_dal_ponte_dell_Accademia.jpg/1280px-Canal_Grande_Chiesa_della_Salute_e_Dogana_dal_ponte_dell_Accademia.jpg",
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
      "disclaimer":"Vorsicht, hier sind Nackideis dabei"
  }
]

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
      sel = mainStack.mainStack.filter(d=>d.subcategory===subcatName)
    } else if (value.includes("cat-")) {
      const catName = value.match(/cat-(.*)/)[1]
      sel = mainStack.mainStack.filter(d=>d.category===catName)
    } else {
      sel = mainStack.mainStack;
    }

    cardStack = prepareCardDeck(sel, true)
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
          <Settings handleSubmit={startGame} cardData={mainStack.mainStack}/>    
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
