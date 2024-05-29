//import cardData from "./full-data-good-articles.json";
//import cardData from "./wikipedia-data-flat.json";


function createOptions(arr) {

    // create nested object
    const obj = []
    const allCats = [arr[0].category]
    let allSubcats = []
    for (const [i,elem] of arr.entries()) {
        if (!allCats.includes(elem.category) || i === arr.length-1) {
            obj.push({
                "category":allCats.slice(-1)[0],
                "subcategories": allSubcats,
            })
            allCats.push(elem.category)
            allSubcats = []
            allSubcats.push(elem.subcategory)
        } else {
            if (!allSubcats.includes(elem.subcategory)) {
                allSubcats.push(elem.subcategory)
            }
        }
    }

    // add num of articles
    const newObj = obj.map(d=>{
        const cat_len = arr.filter(e=>e.category === d.category).length
        const subcats = d.subcategories.map(f=>{
            const subcat_len = arr.filter(g=>g.subcategory===f).length
            return {"subcategory":f, "articles":subcat_len}
        })
        return {...d,"articles":cat_len, "subcategories":subcats}
    }) 

    return newObj

}

export function Settings({handleSubmit,cardData}) {

    return (
        <>
            <h1 style={{"textAlign":"center"}}>Choose your Cardstack ...</h1>
            <form className="mt-4 ps-3 pe-3 ps-md-0 pe-md-0" method="post" onSubmit={handleSubmit}>
                <SelectCards cardData={cardData} />
                <div style={{"textAlign":"center"}}>
                    <button type="submit" className="btn btn-primary mt-4">Start Game!</button>
                </div>
            </form>
        </>
    )
}

function SelectCards({cardData}) {

    const options = createOptions(cardData)
        .filter(d=>d.category !== "")
        .map((d)=>{
            const cat = <option 
                key={"cat-"+ d.category} 
                value={"cat-"+ d.category} 
                style={{"fontWeight":"bold"}}>
                    {d.category} ({d.articles})
                </option>
            const subcats = d.subcategories.filter(e=>e.subcategory!=="").map((e)=>{
                //const numArticles = e.subcat_articles.length
                return (
                    <option 
                    key={"cat-"+d.category+"-subcat-"+e.subcategory} 
                    value={"cat-"+d.category+"-subcat-"+e.subcategory}
                    disabled = {e.articles < 12 ? true : null}>
                        -- {e.subcategory} ({e.articles})</option>
                )
            })
            return ([cat,...subcats])
        })

    const numAllCards = cardData.length

    return (
        <>
            <select className="form-select">
                <option key="all-cards" value="all-cards" style={{"fontWeight":"bold"}}>Alle Karten ({numAllCards})</option>
                {options}
            </select>
        </>
    )
}

export function Disclaimer() {
    return (
        <div>
            <h6 style={{"textAlign":"center"}} className="mt-5">+++ Disclaimer +++</h6>
            <p style={{"textAlign":"center", "fontSize":"0.8em"}} >Some content may appear within the game that users may find inappropriate or disturbing - such as war crimes, genocides, sexual content, etc. This is because the dataset was built from specific Wikipedia articles that were marked as "good" by the German Wikipedia community. I decided to leave all topics untouched so that each user can decide whether he or she wants to learn more about them or not. If you feel uncomfortable with these things, please do not play the game.</p>
        </div>
    )
}