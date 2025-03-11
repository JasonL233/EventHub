import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Box, Heading, HStack, Image, Text } from '@chakra-ui/react';
import LikeButton from './LikeButton';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';
import { useUserStore } from '../../store/user';
import EventButton from './EventButton';

const EventCard = ({event, user}) => {
  const navigate = useNavigate();   // Add React Router navigate function

  // console.log(user);
  const {updateLikes} = useEventStore();
  const {updateLikedPost} = useUserStore();
  const openLogin = useDialogStore((state) => state.openLogin);

  const [likes, setLikes] = useState(event.likes);
  const [liked, setLiked] = useState(false);

  // Recalculate the user & event.likedBy when use changes
  useEffect(() => {
    if (user && event.likedBy){
      setLiked(event.likedBy.includes(user._id));
    }
  }, [user, event.likedBy]);

  const handleLike = (isLiked) => {
    if (user)   // If logged in, update liking feature accordingly. Else, direct to login page
    {      
      setLiked(isLiked);
      setLikes(currLikes => {
          const newLikes = isLiked ? currLikes + 1 : currLikes - 1;
          updateLikes(event._id, user._id, isLiked, newLikes);  // For events: Store users that liked this post
          updateLikedPost(user._id, event._id, isLiked); // For users: Store events that the user liked
          return newLikes;
      });
    }
    else
      openLogin();
  }

  // console.log(event.publisherId?.username);

  return (
    <Box rounded='lg' overflow='hidden' transition='all 0.3s' _hover={{ transform: "translateY(-5px)", shadow: "x1"}} m={1} maxW="400px" w="full">
        <EventButton id = {event._id} mediaSrc = {event.mediaUrl} eventTitle = {event.title} isImage = {event.eventType === "image"}/>
        <Box p={4}>
            <Heading as='h3' size='md' mb={2} color="black">
                {event.title}
            </Heading>

            <HStack spacing={2} justifyContent="space-between" w="full">
                <HStack>
                  {/* Add an onClick event to redirect to the Profile Page when clicking on the avatar */}
                  <Image 
                    src={event.publisherId?.profileImage || null} 
                    boxSize="25px" 
                    objectFit="cover" 
                    m={0} 
                    p={0}
                    cursor="pointer"
                    onClick={() => navigate(`/profile/${event.publisherId?._id}`)}
                  />

                  {/* Add an onClick event to redirect to the Profile Page when a user clicks on the user name */}
                  <Text 
                    color="black"
                    cursor="pointer"
                    _hover={{
                      color: "blue.500",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/profile/${event.publisherId?._id}`)}
                  >
                    {event.publisherId?.username || "Unkonwn user"}
                  </Text>
                  
                </HStack>
                
                <HStack spacing={2}>
                  <LikeButton initialLiked={liked} user={user} onLike={handleLike}/>
                  <Text color="black" fontFamily="sans-serif" fontSize="md">{likes}</Text>
                </HStack>
            </HStack>
        </Box>
    </Box>
  )
}

export default EventCard

