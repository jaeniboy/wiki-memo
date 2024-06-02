export function End({handleClick, numMoves, handleShowCards}) {
    return (
        <>
        <div style={{"textAlign":"center"}}>
            <h1 className="mb-4">The End Page</h1>
            <img className="end-page-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Everlasting_Fireworks_looped.gif/180px-Everlasting_Fireworks_looped.gif" alt="animation of firework"/>
            <div className="mt-3 mb-1">It took <b>{numMoves}</b> moves to get you there</div>
            <div>
                <button style={{"width":"fit-content"}} className="btn btn-outline-light mt-3 mb-3" onClick={handleClick}>Play it again!</button>
            </div>
            <small className="mt-5">Wait... thats all?!<br />
                <span 
                    onClick={handleShowCards} 
                    style={{"cursor":"pointer"}}
                    className="link-light">Show me my cards at least!
                </span>
            </small>
        </div>
        </>
    )
}