import React, { useState, useEffect, useRef } from 'react'
import { Image, Box, Icon, Button } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { FaRegCirclePlay } from "react-icons/fa6";

const EventButton = ( {id, mediaSrc, eventTitle, isImage} ) => {
    const [image, setImage] = useState(mediaSrc);
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    const iframeRef = useRef(null);

    useEffect(() => {
        setImage(mediaSrc);
    }, [mediaSrc]);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
          for (let entry of entries) {
            setWidth(entry.contentRect.width);
          }
        });
    
        if (containerRef.current) {
          observer.observe(containerRef.current);
        }
        window.handleClick = handleClick;

        return () => observer.disconnect();
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
                <Box position="relative" ref={containerRef} onClick={handleClick}>
                    <iframe
                    ref={iframeRef}
                    src={mediaSrc}
                    alt={eventTitle} 
                    width={'100%'}
                    height={width*0.5625}
                    style={{  borderRadius: "1rem", objectFit: "cover", pointerEvents: 'none'}}
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