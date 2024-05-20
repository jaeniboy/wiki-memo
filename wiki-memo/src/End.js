export function End({handleClick, numMoves}) {
    return (
        <>
            <h1 style={{"textAlign":"center"}}>The End Page</h1>
            <div style={{"textAlign":"center"}} className="mt-1 mb-4">It took you <b>{numMoves}</b> moves to get here</div>
            <img style={{"width":"250px"}} alt="funny 'the end' gif" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2FlNjFicXBjMXkwODN5dDl1YXpobXB1b2Q2OGZyemFoNWF2ODNnaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12xSrwKxHxB3BS/giphy.webp" />
            <button style={{"width":"fit-content", "textAlign":"center"}} className="btn btn-primary mt-4" onClick={handleClick}>Play it again, Sam!</button>
        </>
    )
}