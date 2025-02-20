import React, { useState, useEffect } from 'react'
import { Box, Heading, HStack, Image} from '@chakra-ui/react';
import LikeButton from './LikeButton';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';

const EventCard = ({event, user}) => {
  console.log(user);
  const {updateLikes} = useEventStore();
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
          updateLikes(event._id, user._id, isLiked, newLikes);
          return newLikes;
      });
    }
    else
      openLogin();
  }

  return (
    <Box shadow='lg' rounded='lg' overflow='hidden' transition='all 0.3s' _hover={{ transform: "translateY(-5px)", shadow: "x1"}} m={5}>
        <Image src={event.image} alt={event.title} h={48} w='full' objectFit='cover' />

        <Box p={4}>
            <Heading as='h3' size='md' mb={2}>
                {event.title}
            </Heading>

            <HStack spacing={2}>
                <LikeButton initialLiked={liked} user={user} onLike={handleLike}/>
                <span>{likes}</span>
            </HStack>
        </Box>
    </Box>
  )
}

export default EventCard
