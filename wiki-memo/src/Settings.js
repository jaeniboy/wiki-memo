import cardData from "./full-data-good-articles.json";
import testData from "./wikipedia-data-flat.json";

// function createOptions(arr) {

//     // remove unneccessary content
//     const cleanedObjects = arr.map(d => { return {"category":d.category, "subcategory":d.subcategory}})
//     // get unique cat-subcat-pairs
//     const uniqueObjects = cleanedObjects.filter((v,i,a)=>a.findIndex(v2=>(v.category === v2.category && v.subcategory===v2.subcategory))===i)
    
//     // create a nested object
//     let nestedCats = []
//     let cat = uniqueObjects[0].category
//     let subcats = []
//     for (const [i,obj] of uniqueObjects.entries()) {
//         if (obj.category !== cat || i === uniqueObjects.length-1) {
//             if (i === uniqueObjects.length-1) {
//                 subcats.push(obj.subcategory)
//             }
//             // add num of articles to each subcategory
//             const newObj = {}
//             newObj[cat] = subcats.map(d => {
//                 const len = cleanedObjects.filter(e => e.subcategory === d).length
//                 return {"subcategory":d, "articles":len}
//             })
//             nestedCats.push(newObj)
//             cat = obj.category
//             subcats = []
//             subcats.push(obj.subcategory)
//         } 
//         else {
//             subcats.push(obj.subcategory)
//         }
//     }
//     return nestedCats

// }

function createOptions_a(arr) {

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

    console.log(newObj)

}

//console.log(createOptions(testData))
console.log(createOptions_a(testData))



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

    // const flatoptions = createOptions(testData).map(d=>{
    //     const cat = <option
    //         key={d.}
    // })

    return (
        <>
            <select className="form-select">
                <option key="all-cards" value="all-cards" style={{"fontWeight":"bold"}}>Alle Kategorien</option>
                {options}
            </select>
        </>
    )
}