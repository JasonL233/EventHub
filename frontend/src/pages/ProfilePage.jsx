import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/user';
import { useEventStore } from '../store/event';
import { Box, Container, Heading, Image, Text, VStack, Grid, GridItem} from "@chakra-ui/react";
import EventCard from "../components/ui/EventCard"; // Ensures EventCard components has been imported

const ProfilePage = () => {
  const curr_user = useUserStore((state) => state.curr_user);
  const {events, fetchEvents} = useEventStore();

  // State to store liked events and posted events (for event organizers)
  const [likedevents, setLikedevents] = useState([]);
  const [organizerPosts, setOrganizerPosts] = useState([]); 

  useEffect(() => {
    if (curr_user) {
      fetchEvents(); // Ensure all event data is fetched

      // Filter liked posts
      setLikedevents(events.filter(event => curr_user.likedPosts.includes(event._id)));

      // If the user is an event organizer, filter their posted events
      if (curr_user.isEventOrganizer) {
        const eventsPosts = events.filter(event => event.publisherId === curr_user._id);
        setOrganizerPosts(eventsPosts);
      }
    }
  }, [curr_user, events, fetchEvents]);

  {/* If currUser exists, directly get currUser.isEventOrganizer.
      If currUser is empty (not logged in), 
      the default value is false to prevent errors caused by undefined. */}
  let isEventOrganizer = false;  // Set the isEventOrganizer is false
  if (curr_user) {
    isEventOrganizer = Boolean(curr_user.isEventOrganizer);
  }

  

  return (
    <Container maxW="container.md" py={8}>
      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
        
        {/* User Info Section */}
        <GridItem colSpan={5}>
          <Grid templateColumns="repeat(6, 1fr)" alignItems="center" gap={4}>
            <GridItem colSpan={2} display="flex" justifyContent="center">
              {/* Profile Picture */}
              <Image
                borderRadius="full"
                boxSize="200px"
                src= "https://cdn.kinocheck.com/i/tw5o2a0n6a.jpg"
                alt="User Avatar"
              />
            </GridItem>
            <GridItem colSpan={4}>
            <VStack align="start">
              {/* User Name and ID */}
                <Heading size="2xl" color="black">{curr_user.username}</Heading>
                <Text fontSize="xl" color="black">ID: {curr_user._id}</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="black">1</Text>
                    {/* user: following; event organizer: followers */}
                    <Text fontSize="lg" color="black">{isEventOrganizer ? "Followers" : "Following"}</Text>
                  </VStack>
                  
                </Grid>
              </VStack>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      
      {/* Posts/Likes Section */}
      <Box textAlign="center" mt={8}>
        {/* user: Likes; event: Posts */}
        <Heading size="2xl" color="black">{isEventOrganizer ? "Posts" : "Likes"}</Heading>
        <Box borderBottom="2px solid black" width="100%" my={4} />
      </Box>

       {/* If user is an event organizer, show their posted events with likes */}
      {isEventOrganizer ? (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {organizerPosts.length > 0 ? (
            organizerPosts.map(event => {
              // Extract first sentence of description
              const truncatedDescription = event.description.split(/[.\n]/)[0] + "...";
              
              return (
                <GridItem key={event._id} p={4} borderWidth={1} borderRadius="md">
                  <VStack align="start">
                    <Heading size="md" color="black">{event.title}</Heading>
                    <Text color="gray.600">{truncatedDescription}</Text>
                    <Text fontWeight="bold" color="black">Likes: {event.likes}</Text>
                  </VStack>
                </GridItem>
              );
            })
          ) : (
            <Text textAlign="center" color="gray.500" fontSize="lg">No posts yet</Text>
          )}
        </Grid>
      ) : (
        // If user is not an event organizer, show liked posts
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {likedevents.length > 0 ? (
            likedevents.map(event => (
              <GridItem key={event._id} p={4} borderWidth={1} borderRadius="md">
                <VStack align="start">
                  <Heading size="md" color="black">{event.title}</Heading>
                  <Text color="gray.600">{event.description.split(/[.\n]/)[0] + "..."}</Text>
                </VStack>
              </GridItem>
            ))
          ) : (
            <Text textAlign="center" color="gray.500" fontSize="lg">No liked posts</Text>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default ProfilePage
