import React, { useState, useEffect } from 'react'
import { Image, Box, Icon } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { FaRegCirclePlay } from "react-icons/fa6";

const EventButton = ( {id, mediaSrc, eventTitle, isImage} ) => {
    const [image, setImage] = useState(mediaSrc);
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
                <Box position="relative" >
                    <video 
                    src={mediaSrc} 
                    alt={eventTitle} 
                    width="100%" 
                    height="auto" 
                    style={{ borderRadius: "1rem", objectFit: "cover" }}
                    />

                    {/* Play Icon */}
                    <Box
                        position="absolute"
                        top="5%"    
                        right="5%"
                    >
                        <Icon as={FaRegCirclePlay} boxSize={4} opacity={0.87}/>
                    </Box>
                </Box>
            )}
            </button>
        </Link>
        
    )
}

export default EventButton