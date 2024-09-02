import React, {useState, useEffect} from 'react';
import './ImageSlider.css';
import image1 from '../../Images/Open Doodles Stuff To Do.png';
import image2 from '../../Images/Stuck at Home To Do List.png';



const ImageSlider = () => {
const images = [
    {img: image1,
     text:'Tired of the infinite loop of learning and forgetting new vocabulary? '
    },
    {img: image2,
     text:'Save your translations, reinforce your learning through games'
    }    
];
const [currentImage, setCurrentImage] = useState<number>(0);
const [fadeOut, setFadeOut] = useState<boolean>(false);

useEffect(() => {
const fadeTimeOut = setTimeout(() => {
    setFadeOut(true)
}, 2000)

const switchImageTimeout = setTimeout(() => {
    setFadeOut(false);
    setCurrentImage((prev) => (prev + 1) % images.length);
}, 3000);

return () => {
    clearTimeout(fadeTimeOut);
    clearTimeout(switchImageTimeout);
}
},[images.length])

  return (
    <div className="image-container">
        <div className={`fade-image ${fadeOut? 'fade-out' : 'fade-in'}`}>
        <img
        className={`fade-image ${fadeOut? 'fade-out' : 'fade-in'}`}
        src={images[currentImage].img}
        alt='sliding content'
        />
        </div>
        
        <div className={`fade-image ${fadeOut? 'fade-out' : 'fade-in'}`}>
        <p className={`fade-image ${fadeOut? 'fade-out' : 'fade-in'}`}>{images[currentImage].text}</p>
        </div>
    </div> 
  )


}

export default ImageSlider
