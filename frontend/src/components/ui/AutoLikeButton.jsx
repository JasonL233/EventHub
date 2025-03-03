import React, { useState, useEffect } from 'react'
import { HStack, Text, Button } from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';

const AutoLikeButton = ( {event} ) => {
    const [curEvent, setCurEvent] = useState(event)
    const {updateLikes} = useEventStore();
    const {updateLikedPost} = useUserStore();
    const openLogin = useDialogStore((state) => state.openLogin); // Login Page
    const user = useUserStore((state) => state.curr_user); // Current User

    const [likes, setLikes] = useState(curEvent.likes); // Number of likes
    const [liked, setLiked] = useState(false); // If the event liked by user

    const [isInitial, setIsInitial] = useState(false);

    // Update Event, Likes Number, and Liked Status
    useEffect(() => {
        if (!isInitial) {
            // Update New Event and Likes
            if (event) {
                setCurEvent(event);
                setLikes(curEvent.likes);
            }
            // Update Liked Status of Current User
            if (user && curEvent.likedBy) {
                setLiked(curEvent.likedBy.includes(user._id));
            }
            if (likes && liked) {
                setIsInitial(true);
            }
        }
    }, [user, event, curEvent.likedBy]);

    // Handle User Clicking Like Icon
    const handleClick = () => {
        // If user login  then update likes
        if (user) {
            let isLiked = !liked;
            setLiked(isLiked);
            setLikes((currLikes => {
                const newLikes = isLiked ? currLikes + 1 : currLikes - 1;
                updateLikes(curEvent._id, user._id, isLiked, newLikes); // Update Event Information
                updateLikedPost(user._id, curEvent._id, isLiked); // Update User Information
                console.log(newLikes);
                return newLikes;
            }));
        }
        // If user doesn't login, then pop login page
        else {
            openLogin();
        }
    }

    return (
        <HStack spacing={2}>
            <Button 
                onClick={handleClick} 
                style={{ 
                    border: 'none', 
                    background: 'transparent', 
                    cursor: 'pointer', 
                    fontSize: '24px', 
                    transition: 'color 0.3s ease-in-out', 
                    color: 'black'
                }} 
                aria-label="Like button"
                _hover={{
                    transition: "0.5s ease-in-out",
                    transform: "scale(1.5)"
                }}
            >
                <Text 
                    color="black" 
                    fontFamily="sans-serif" 
                    fontSize="md"
                >
                    {likes}
                </Text>
                <FaHeart 
                    style={{ 
                        color: (liked && user) ? 'red' : 'lightgray', 
                        transition: 'color 0.3s', 
                }}/>  
            </Button>
            
        </HStack>
    )
}

export default AutoLikeButton
