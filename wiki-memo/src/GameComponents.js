export function Board({children}) {
    return (
    <div className="board-wrapper d-flex justify-content-center">
            <div className="board">
                {children}
            </div>
    </div>
    )
}

export function Card({handleFlip, data}) {
    return (
        <div className={"memo-card "  + (data.onBoard === false ? "card-hidden" : null)} onClick={handleFlip}>
            <div style={{backgroundImage: `url("${data.img_url}")`}} className={"card-front " + (data.position !== "faceUp" && "hidden")}>
            </div>
            <div className={"card-back " + (data.position === "faceUp" && "hidden")}></div>
        </div>
    )
}

export function InfoOnPair({handleRemovePair, flippedCard}) {
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