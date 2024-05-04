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

  const cardStack = suffleCardStack(duplicateCardStack(cardData))
  const [cards, setCards] = useState(cardStack)
  const numCardsFlipped = countCardsFlipped(cards)

  if (numCardsFlipped === 2) {

    const cardsFlipped = cards.filter((d)=> {return d.position === "faceUp"})

    if (cardsFlipped[0].pair === cardsFlipped[1].pair) {
      console.log("Pair!")
      const pairRemoved = cards.map((d)=> {
        if (d.position === "faceUp") {
          return {...d, onBoard: false, position: "faceDown"}
        } else {
          return d
        }
      })
      setTimeout(()=>setCards(pairRemoved),1000) 
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

export default App;
