import cardData from "./full-data-good-articles.json";

export function Settings({handleClick}) {

    return (
        <>
            <h1>Settings first!</h1>
            <SelectCards />
            <button className="btn btn-primary" onClick={handleClick}>Click</button>
        </>
    )
}

function SelectCards() {

    const options = cardData.map((d)=>{

        const cat = <option value={"cat-id-"+ d.id} style={{"font-weight":"bold"}}>{d.category_title}</option>
        const subcats = d.subcategories.map((e)=>{
            return (
                <option value={"subcat-id-"+e.id}>-- {e.subcat_title}</option>
            )
        })

        return (
            [cat,...subcats]
        )
    })

    return (
        <>
            <select className="form-select">
                <option value="" style={{"font-weight":"bold"}}>Alle Kategorien</option>
                {options}
            </select>
        </>
    )
}