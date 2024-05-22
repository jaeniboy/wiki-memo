import cardData from "./full-data-good-articles.json";

export function Settings({handleSubmit}) {

    return (
        <>
            <h1 style={{"textAlign":"center"}}>Choose your Cardstack ...</h1>
            <form className="mt-4 ps-3 pe-3 ps-md-0 pe-md-0" method="post" onSubmit={handleSubmit}>
                <SelectCards />
                <div style={{"textAlign":"center"}}>
                    <button type="submit" className="btn btn-primary mt-4">Start Game!</button>
                </div>
            </form>
        </>
    )
}

function SelectCards() {

    // create selection options
    const options = cardData.map((d)=>{
        const cat = <option 
            key={"cat-"+ d.id} 
            value={"cat-"+ d.id} 
            style={{"fontWeight":"bold"}}>
                {d.category_title}
            </option>
        const subcats = d.subcategories.map((e)=>{
            const numArticles = e.subcat_articles.length
            return (
                <option 
                key={"cat-"+d.id+"-subcat-"+e.id} 
                value={"cat-"+d.id+"-subcat-"+e.id}
                disabled = {numArticles < 12 ? true : null}>
                    -- {e.subcat_title} <span>({numArticles})</span></option>
            )})
        return ([cat,...subcats])
    })

    return (
        <>
            <select className="form-select">
                <option key="all-cards" value="all-cards" style={{"fontWeight":"bold"}}>Alle Kategorien</option>
                {options}
            </select>
        </>
    )
}