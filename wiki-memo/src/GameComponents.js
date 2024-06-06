export function Board({children}) {
    return (
    <div className="full-screen vh-100 vw-100 d-flex align-items-center justify-content-center"> 
    <div className="board-wrapper d-flex justify-content-center ">
            <div className="board">
                {children}
            </div>
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

    return (
        <div id="card-infobox-container" className="row d-flex justify-content-center align-items-center" onClick={handleRemovePair}>
            <div id="card-infobox" className="row bg-light p-3 rounded-2 overflow-auto">
                <h1>Pair!</h1>
                <div>
                    <div className="card-image-wrapper me-3" style={{"float":"left"}}>
                        {/* <a href={flippedCard.img_info_url}> */}
                            <img src={flippedCard.img_url} alt="" className="float-md-start card-image w-100"></img>
                        {/* </a> */}
                        <div>
                            <small className="image-credit"><a href={flippedCard.img_info_url}>Picture:</a> {flippedCard.img_artist} <a href={flippedCard.img_license_link}>{flippedCard.img_license}</a></small>
                        </div>
                    </div>
                    <div className="">
                        <h3 id="card-title">{flippedCard.title}</h3>
                        <div id="card-description">{flippedCard.summary} 
                            <span className="ms-1"><a href={flippedCard.link} target="_blank" rel="noreferrer">Read more</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}