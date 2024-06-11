import { ArrowLeft } from 'react-bootstrap-icons';

function compare( a, b ) {
    if ( a.category_count < b.category_count ){
      return 1;
    }
    if ( a.category_count > b.category_count ){
      return -1;
    }
    return 0;
  }

function createOptions(arr) {
    let allCategories = []
    // concat all categories to array
    for (const obj of arr) {
        allCategories = allCategories.concat(obj.category)
    }
    console.log(allCategories)
    // count all occurancies
    let categoryCounts = {}
    for (const category of allCategories) {
        categoryCounts[category] = categoryCounts[category] ? categoryCounts[category] + 1 : 1;
    }
    console.log(categoryCounts)
    // build sorted array
    let arrayOfObjects = []
    for (const key of Object.keys(categoryCounts)) {
        arrayOfObjects.push(
            {
                "category_title": key,
                "category_count": categoryCounts[key]
            }
        )
    }

    console.log(arrayOfObjects.sort(compare))
    return arrayOfObjects.sort(compare)
}

export function Settings({handleSubmit,cardData, handleBacklink}) {

    return (
        <>
            <h1 style={{"textAlign":"center"}}>Choose your substack ...</h1>
            <form className="mt-4 ps-3 pe-3 ps-md-0 pe-md-0" method="post" onSubmit={handleSubmit}>
                <SelectCards cardData={cardData} />
                <div style={{"textAlign":"center"}}>
                    <button type="submit" className="btn btn-outline-light mt-4">Start Game!</button>
                </div>
                <div style={{"textAlign":"center"}} className="mt-4">
                    <span onClick={handleBacklink} className="link-light" role="button"><ArrowLeft /> Back to Preview Page</span>
                </div>
            </form>
        </>
    )
}

function SelectCards({cardData}) {

    const options = createOptions(cardData)
        .filter(d=>d.category_count >= 12)
        .map((d)=>{ return(
            <option key={d.category_title} value={d.category_title}>
                {d.category_title} ({d.category_count})
            </option>
        )})
        // .filter(d=>d.category !== "")
        // .map((d)=>{
        //     const cat = <option 
        //         key={"cat-"+ d.category} 
        //         value={"cat-"+ d.category} 
        //         style={{"fontWeight":"bold"}}>
        //             {d.category} ({d.articles})
        //         </option>
        //     const subcats = d.subcategories.filter(e=>e.subcategory!=="").map((e)=>{
        //         //const numArticles = e.subcat_articles.length
        //         return (
        //             <option 
        //             key={"cat-"+d.category+"-subcat-"+e.subcategory} 
        //             value={"cat-"+d.category+"-subcat-"+e.subcategory}
        //             disabled = {e.articles < 12 ? true : null}>
        //                 -- {e.subcategory} ({e.articles})</option>
        //         )
        //     })
        //     return ([cat,...subcats])
        // })

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

export function Disclaimer({handleAccept, handleQuit, text}) {
    return (
        <div>
            <h3 style={{"textAlign":"center"}} className="mt-5">+++ Disclaimer +++</h3>
            <p style={{"textAlign":"center"}}>{text}</p>
            <div style={{"textAlign":"center"}}>
                <button className="btn btn-outline-light btn-sm" onClick={handleAccept}>That's ok!</button><button onClick={handleQuit} className="btn btn-sm btn-outline-light ms-2">No, better not</button>
            </div>
        </div>
    )
}