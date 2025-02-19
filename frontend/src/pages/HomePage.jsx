import { Container, VStack, Text, SimpleGrid} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useEventStore } from '../store/event'
import React, { useEffect } from 'react'
import EventCard  from '../components/ui/EventCard'


const HomePage = () => {
  const {fetchEvents, events} = useEventStore();

  useEffect ( () => {
    fetchEvents();
  }, [fetchEvents]);
  console.log("Events: ", events);

  if (events) { // avoid map to null object
    return (
      <Container>
        <VStack spacing={8}>
  
          <SimpleGrid columns={{base: 2, md: 3, lg: 4}} spacing={10} w={"full"}>
            {events.map((event) => (
              <EventCard key={event._id} event={event}/>
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


}

export default HomePage
