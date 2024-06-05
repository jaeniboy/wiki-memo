import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

export function ShowPreview({handleClick, previewData}) {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const carouselItems = previewData.map((d,i)=> {
        return (
            <Carousel.Item key={d.title}>
                <div className="carousel-image-wrapper">
                    <img className="carousel-image" alt={"preview of cardstack " + d.title} src={d.image} onClick={()=>handleClick(i)}/>
                </div>
                <Carousel.Caption>
                    <h3>{d.title}</h3>
                    <p>{d.description}</p>
                </Carousel.Caption>
            </Carousel.Item>
        )
    })

    return (
        <>
        {/* <h1 style={{"textAlign":"center"}}>Wähle deine Karten</h1> */}
        <Carousel activeIndex={index} onSelect={handleSelect}>
            {carouselItems}
        </Carousel>
        </>
      );
}