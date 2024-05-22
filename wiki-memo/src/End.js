export function End({handleClick, numMoves, handleShowCards}) {
    return (
        <>
            <h1 style={{"textAlign":"center"}}>The End Page</h1>
            <div style={{"textAlign":"center"}} className="mt-1 mb-4">It took <b>{numMoves}</b> moves to get you there</div>
            {/* <div style={{"textAlign":"center"}}>
                <img style={{"width":"250px"}} alt="funny 'the end' gif" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2FlNjFicXBjMXkwODN5dDl1YXpobXB1b2Q2OGZyemFoNWF2ODNnaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12xSrwKxHxB3BS/giphy.webp" />
            </div> */}
            <div style={{"textAlign":"center"}}>
                <button style={{"width":"fit-content"}} className="btn btn-primary mt-4" onClick={handleClick}>Play it again, Sam!</button>
            </div>
            <small className="mt-4" style={{"textAlign":"center"}}>Wait... thats all?!<br />
                <span 
                    onClick={handleShowCards} 
                    style={{"cursor":"pointer"}}
                    className="link-primary">Show me my cards at least!
                </span>
            </small>
        </>
    )
}