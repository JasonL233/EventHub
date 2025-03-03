import React, { useState, useEffect } from 'react'
import {Image} from '@chakra-ui/react';
import { Link } from "react-router-dom";

const EventButton = ( {id, mediaSrc, eventTitle, isImage} ) => {
    const [image, setImage] = useState(mediaSrc);
    console.log(id);
    useEffect(() => {
        setImage(mediaSrc);
    }, [mediaSrc]);

    const handleClick = () => {
        
    }

    return (
        <Link to={`/post/${id}`}>
            <button onClick={handleClick}>
            {isImage ? (
                <Image 
                src={mediaSrc} 
                alt={eventTitle} 
                width="100%" 
                height="auto" 
                objectFit='cover' 
                border="black" 
                borderColor="black" 
                borderRadius="2xl" 
                transition='all 0.3s' 
                _hover={{filter: "brightness(80%)",}}
                />
            ) : (
                <video 
                src={mediaSrc} 
                alt={eventTitle} 
                autoPlay
                muted
                loop
                width="100%" 
                height="auto" 
                style={{ borderRadius: "1rem", objectFit: "cover" }}
                />
            )}
            </button>
        </Link>
        
    )
}

export default EventButton