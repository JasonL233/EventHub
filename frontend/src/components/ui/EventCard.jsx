import React, { useState} from 'react'
import { Box, Heading, HStack, Image} from '@chakra-ui/react';
import LikeButton from './LikeButton';
import { useEventStore } from '../../store/event';

const EventCard = ({event}) => {
  const {updateLikes} = useEventStore();
  const [likes, setLikes] = useState(0); 
  const [liked, setLiked] = useState(false);

  const handleLike = (isLiked) => {
    setLiked(isLiked);
    setLikes(currLikes => {
        const newLikes = isLiked ? currLikes + 1 : currLikes - 1;
        updateLikes(event._id, newLikes);
        return newLikes;
    });
  }

  return (
    <Box shadow='lg' rounded='lg' overflow='hidden' transition='all 0.3s' _hover={{ transform: "translateY(-5px)", shadow: "x1"}} m={5}>
        <Image src={event.image} alt={event.title} h={48} w='full' objectFit='cover' />

        <Box p={4}>
            <Heading as='h3' size='md' mb={2}>
                {event.title}
            </Heading>

            <HStack spacing={2}>
                <LikeButton initialLiked={liked} onLike={handleLike}/>
                <span>{likes}</span>
            </HStack>
        </Box>
    </Box>
  )
}

export default EventCard
