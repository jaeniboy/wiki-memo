import cardData from "./full-data-good-articles.json";

export function Settings({handleSubmit}) {

    // function handleSubmit(e){
    //     e.preventDefault()
    //     console.log(e.target[0].value)
    // }

    return (
        <>
            <h1>Settings first!</h1>
            <form method="post" onSubmit={handleSubmit}>
            <SelectCards />
            <button type="submit" className="btn btn-primary">Click</button>
            {/* <button type="submit" className="btn btn-primary" onClick={handleClick}>Click</button> */}
            </form>
        </>
    )
}

function SelectCards() {

    // choose card backlist based on user selection input
    // function handleChange(e) {
        
    //     let cardSelection = []
    //     const value = e.target.value
    //     const idValues = [...value.matchAll(/[\d]+/g)]

    //     if (value.includes("subcat-")) { // use data from subcategory
    //         cardSelection = cardData[idValues[0]-1]
    //         .subcategories
    //         .filter(d=>d.id===Number(idValues[1]))[0]
    //         .subcat_articles
    //     } else if (value.includes("cat-")) { // use data from category
    //         cardSelection = cardData[idValues[0]-1].subcategories
    //     } else { // use all data
    //         cardSelection = cardData;
    //     }

    //     console.log(cardSelection)
    // }

    // create selection options
    const options = cardData.map((d)=>{
        const cat = <option 
            key={"cat-"+ d.id} 
            value={"cat-"+ d.id} 
            style={{"fontWeight":"bold"}}>
                {d.category_title}
            </option>
        const subcats = d.subcategories.map((e)=>{
            return (
                <option 
                key={"cat-"+d.id+"-subcat-"+e.id} 
                value={"cat-"+d.id+"-subcat-"+e.id}>
                    -- {e.subcat_title}</option>
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