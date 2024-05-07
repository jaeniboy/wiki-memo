import { useState} from "react";
import {cardData} from "./testdata.js";

function duplicateCardStack(arr) {

  // Daten duplizieren und mit einer Pair-Referenz ausstatten

  const numItems = arr.length
  const initialArray = arr.map(d => {return {...d, pair:d.id, onBoard: true}})
  const siblings = initialArray.slice().map(d => {return {...d,id: d.id + numItems}})
  const newArray = initialArray.concat(siblings)

  return newArray

}

function suffleCardStack(array) { //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }

  return array
}

function countCardsFlipped(arr) {
  let cardsFlipped = arr.filter((d)=>{return d.position==="faceUp"})
  return cardsFlipped.length
}

function App() {

  const cardStack = duplicateCardStack(cardData)
  //const cardStack = suffleCardStack(duplicateCardStack(cardData))
  const [cards, setCards] = useState(cardStack)
  const cardsFlipped = cards.filter((d)=> {return d.position === "faceUp"})
  const numCardsFlipped = cardsFlipped.length
  //const numCardsFlipped = countCardsFlipped(cards)
  const [gamePhase, setGamePhase] = useState("flipping") // setup, flipping, pair, end

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
      position={d.position} 
      id={d.pair}
      title={d.title}
      onBoard={d.onBoard}
      handleFlip={()=> numCardsFlipped!==2 && flipCard(d.id)}
      />
  })

  return (
    <>
      {gamePhase === "pair" &&
        <InfoOnPair handleRemovePair={()=>removePair()} flippedCard={cardsFlipped[0]}/>      
      }
      <Board>
        {cardItems}
      </Board>
    </>
  );
}

function Board({children}) {
  return (
    <div className="board vw-75 min-vh-100">
        {children}
    </div>
  )
}

function Card({position, id, title, handleFlip, onBoard}) {

  const image = "https://picsum.photos/id/" + id*40 + "/200"
  return (
    <div className={"memo-card "  + (onBoard === false ? "card-hidden" : null)} onClick={handleFlip}>
      {position === "faceUp" &&
        <div>
          <img className="w-100" src={image} alt={title} />
        </div>
      }
    </div>
  )
}

function InfoOnPair({handleRemovePair, flippedCard}) {
  return (
    <div id="card-infobox-container" className="row d-flex justify-content-center align-items-center" onClick={handleRemovePair}>
      <div id="card-infobox" className="row w-75 h-50 bg-light p-3 rounded-2 overflow-auto">
        <h1>Pair!</h1>
        <div className="">
          <img src={flippedCard.image} className="float-md-start m-3"></img>
          <div className="">
              <h3 id="card-title">{flippedCard.title}</h3>
              <div id="card-description">{flippedCard.description} 
                <span className="ms-1"><a href={flippedCard.link} target="_blank" rel="noreferrer">Read more</a></span>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
