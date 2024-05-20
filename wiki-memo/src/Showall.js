export function Showall({cards}) {
    console.log(cards)

    const cardsUnique = cards.filter(d=>typeof d.id === "number")
    const thumbnails = cardsUnique.map((d)=>{
        return (
            <div className="row h-25">
                <div style=
                    {{
                        "backgroundImage":`url("${d.img_url}")`//,
                        //"height":"100px"
                    }} className="showall-card card-front w-25 ratio ratio-1x1 col-3">
                </div>
                <div className="col-9">
                    <h4>{d.title}</h4>
                    <div>{d.summary}</div>
                </div>
            </div>
        )
    })
    console.log(thumbnails)

    return (
        <>
            <h1>All Cards used in the game</h1>
            {thumbnails}
        </>
    )
}