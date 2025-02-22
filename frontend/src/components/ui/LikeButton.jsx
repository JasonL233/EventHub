import React, { useState, useEffect } from 'react'
import { FaHeart } from 'react-icons/fa';

const LikeButton = ( {initialLiked, user, onLike } ) => {
    const [liked, setLiked] = useState(initialLiked);
    console.log("initialLiked: " + initialLiked);

    useEffect(() => {
        setLiked(initialLiked);
    }, [initialLiked]);

    const handleClick = () => {
        let newLike = liked;

        if (user)
            newLike = !liked;
        
        setLiked(newLike);

        if (onLike)
            onLike(newLike);
    }

    return (
        <button onClick={handleClick} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '24px', transition: 'color 0.3s ease-in-out',}} aria-label="Like button">
            <FaHeart style={{ color: (liked && user) ? 'red' : 'lightgray', transition: 'color 0.3s', }} />          
        </button>
    )
}

export default LikeButton
