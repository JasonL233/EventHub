import React, { useState } from 'react'
import { FaHeart } from 'react-icons/fa';

const LikeButton = ( {initialLikeed = false, onLike } ) => {
    const [liked, setLiked] = useState(initialLikeed);

    const handleClick = () => {
        const newLike = !liked;
        setLiked(newLike);

        if (onLike)
            onLike(newLike);
    }

    return (
        <button onClick={handleClick} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '24px', transition: 'color 0.3s ease-in-out',}} aria-label="Like button">
            <FaHeart style={{ color: liked ? 'red' : 'lightgray', transition: 'color 0.3s', }} />          
        </button>
    )
}

export default LikeButton
