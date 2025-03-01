import React, { useState, useEffect } from 'react'
import {Image} from '@chakra-ui/react';
import { Link } from "react-router-dom";

const EventButton = ( {id, imageSrc, eventTitle} ) => {
    const [image, setImage] = useState(imageSrc);

    useEffect(() => {
        setImage(imageSrc);
    }, [imageSrc]);

    const handleClick = () => {
        
    }

    return (
        <Link to = {'/post'}>
            <button onClick={handleClick}>
                <Image src={imageSrc} alt={eventTitle} width="100%" height="auto" objectFit='cover' border="black" borderColor="black" borderRadius="2xl" />
            </button>
        </Link>
        
    )
}

export default EventButton