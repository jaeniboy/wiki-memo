import { BoxArrowUpRight, ArrowClockwise } from 'react-bootstrap-icons'

export function Showall({cards, handleClick}) {

    const cardsUnique = cards.filter(d=>typeof d.id === "number")
    const thumbnails = cardsUnique.map((d)=>{
        return (
            <div className="row ms-3 mb-4 me-2 mh-25" style={{ "overflow":"hidden", }}>
                <div className="col-sm-3">
                   <div style=
                        {{
                            "backgroundImage":`url("${d.img_url}")`,
                            "width":"100%",
                            "height":"auto",
                            "color":"black",
                        }} className="showall-card card-front ratio ratio-1x1 p-0">
                    </div>
                    <small className="image-credit"><a href={d.img_info_url}>Picture:</a> {d.img_artist} <a href={d.img_license_link}>{d.img_license}</a></small>
                </div>
                <div className="col-sm-9" style={{"maxHeight":"200px"}}>
                    
                    <h4>{d.title} <a href={d.link} target="_blank"  rel="noreferrer"><BoxArrowUpRight className="mb-1 ms-2" size={16} /></a></h4>
                    <div className="show-all-text-box" style={{"height":"100%", "overflow":"hidden"}}>{d.summary}</div>
                </div>
            </div>
        )
    })

    return (
        <>
            <h1 className="ms-4 mb-5 mt-4">All Cards used  
                <button className='btn btn-outline-primary btn-sm ms-3 mb-1' onClick={handleClick}>Restart Game 
                    <ArrowClockwise className="mb-1 ms-1"/>
                </button>
            </h1>
            {thumbnails}
        </>
    )
}