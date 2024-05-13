import {useState} from "react";
import cardData from "./full-data-good-articles.json";
import {Settings} from "./Settings.js"
//import cardData from "./av.json";

//To-Do: Bugfix /wiki/Seattle_Storm

const cardSelection = drawRandomCards(cardData)

function getRandIndex(arr) {
  return Math.floor(Math.random() * arr.length)
}

function drawRandomCards(cards) {

  let drawnCards = []
  let drawnUrls = []
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

    if (!drawnUrls.includes(card.link)) {
      drawnCards.push(card)
      drawnUrls.push(card.link)
    }
  }
  return drawnCards
}

function duplicateCardStack(arr) {

  // Daten duplizieren und mit einer Pair-Referenz ausstatten
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

function App() {

  const cardStack = shuffleCardStack(duplicateCardStack(cardSelection))
  //const cardStack = shuffleCardStack(duplicateCardStack(cardData))
  const [cards, setCards] = useState(cardStack)
  const cardsFlipped = cards.filter((d)=> {return d.position === "faceUp"})
  const numCardsFlipped = cardsFlipped.length
  const [gamePhase, setGamePhase] = useState("setup") // setup, flipping, pair, end

  const startGame = () => {setGamePhase("flipping")}

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
    setGamePhase("flipping")
  }

  const cardItems = cards.map(d => {
    return <Card 
      key={d.id}
      // position={d.position} 
      // id={d.pair}
      // title={d.title}
      // onBoard={d.onBoard}
      // image={d.img_url}
      data = {d}
      handleFlip={()=> numCardsFlipped!==2 && flipCard(d.id)}
      />
  })

  return (
    <>
      {gamePhase === "setup" &&
        <Settings handleClick={startGame}/>      
      }
      {gamePhase === "pair" &&
        <InfoOnPair handleRemovePair={()=>removePair()} flippedCard={cardsFlipped[0]}/>      
      }
      {gamePhase !== "setup" &&
        <Board>
          {cardItems}
        </Board>
      }
    </>
  );
}

function Board({children}) {
  return (
  <div className="board-wrapper d-flex justify-content-center">
        <div className="board">
            {children}
        </div>
  </div>
  )
}

function Card({handleFlip, data}) {
  console.log(data)
  return (
    <div className={"memo-card "  + (data.onBoard === false ? "card-hidden" : null)} onClick={handleFlip}>
        <div style={{backgroundImage: `url("${data.img_url}")`}} className={"card-front " + (data.position !== "faceUp" && "hidden")}>
        </div>
        <div className={"card-back " + (data.position === "faceUp" && "hidden")}></div>
    </div>
  )
}

function InfoOnPair({handleRemovePair, flippedCard}) {
  const link = "https://de.wikipedia.org" + flippedCard.link
  return (
    <div id="card-infobox-container" className="row d-flex justify-content-center align-items-center" onClick={handleRemovePair}>
      <div id="card-infobox" className="row w-75 h-50 bg-light p-3 rounded-2 overflow-auto">
        <h1>Pair!</h1>
        <div className="">
          <img src={flippedCard.img_url} alt="" className="float-md-start m-3 card-image w-25"></img>
          <div className="">
              <h3 id="card-title">{flippedCard.title}</h3>
              <div id="card-description">{flippedCard.summary} 
                <span className="ms-1"><a href={link} target="_blank" rel="noreferrer">Read more</a></span>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default App;
