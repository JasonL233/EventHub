import { Container, VStack, Text, SimpleGrid} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
// Components
import EventCard  from '../components/ui/EventCard';
// Stores
import { useEventStore } from '../store/event';
import { useUserStore } from '../store/user';


const HomePage = () => {
  const {fetchEvents, events} = useEventStore();
  const currUser = useUserStore((state) => state.curr_user);

  useEffect ( () => {
    fetchEvents();
  }, [fetchEvents]);
  console.log("Events: ", events);

  return (
    <Container>
      <VStack spacing={8}>

        <SimpleGrid columns={{base: 2, md: 3, lg: 4}} spacing={10} w={"full"}>
          {events.map((event) => (
            <EventCard key={event._id} event={event} user={currUser}/>
          ))}
        </SimpleGrid>
        
        {events.length === 0 && (
          <Text fontSize='x1' fontWeight={"bold"} textAlign={"Center"} color='black'>
            <Link to={"/create"}>
              <Text as='span' color='white' _hover={{textDecoration: "underline"}}>
                Create an event
              </Text>
            </Link>
         </Text>
        )}
        
      </VStack>
    </Container>
  )
}

export default HomePage
