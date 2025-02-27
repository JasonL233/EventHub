import React, { useState, useEffect } from 'react'
import { Box, Heading, HStack, Image, Text } from '@chakra-ui/react';
import LikeButton from './LikeButton';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';
import { useUserStore } from '../../store/user';

const EventCard = ({event, user}) => {
  console.log(user);
  const {updateLikes} = useEventStore();
  const {updateLikedPost} = useUserStore();
  const openLogin = useDialogStore((state) => state.openLogin);
  const users = useUserStore((state) => state.users); 

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

  return (
    <Box rounded='lg' overflow='hidden' transition='all 0.3s' _hover={{ transform: "translateY(-5px)", shadow: "x1"}} m={5} maxW="400px" w="full">
        <Image src={event.image} alt={event.title} width="100%" height="auto" objectFit='cover' border="black" borderColor="black" borderRadius="2xl" />

        <Box p={4}>
            <Heading as='h3' size='md' mb={2} color="black">
                {event.title}
            </Heading>

            <HStack spacing={2} justifyContent="space-between" w="full">
                <Text color="black">{findUsername(users, event.publisherId)}</Text>
                
                <HStack spacing={2}>
                  <LikeButton initialLiked={liked} user={user} onLike={handleLike}/>
                  <Text color="black" fontFamily="sans-serif" fontSize="md">{likes}</Text>
                </HStack>
            </HStack>
        </Box>
    </Box>
  )
}

const findUsername = (users, publisherId) => {
  const user = users.find((user) => user._id === publisherId);
  console.log("USERNAME", user);
  return user ? user.username : "Unknown User";
};

export default EventCard
