import React from 'react'
import { useUserStore } from '../store/user';
//import { useEvent } from '../store/event';
import { Box, Container, Heading, Image, Text, VStack, Grid, GridItem} from "@chakra-ui/react";

const ProfilePage = () => {
  const curr_user = useUserStore((state) => state.curr_user);
  //const { get_Events, events } = useEvent();

  {/* If currUser exists, directly get currUser.isEventOrganizer.
      If currUser is empty (not logged in), 
      the default value is false to prevent errors caused by undefined. */}
  let isEventOrganizer = false;  // Set the isEventOrganizer is false
  if (curr_user) {
    isEventOrganizer = Boolean(curr_user.isEventOrganizer);
  }

  // Store the current user's post list
  //const [userPosts, setUserPosts] = useState([]);

  //useEffect(() => {
   // get_Events(); // Get all event data
 // }, [get_Events]);

  //useEffect(() => {
    //if (curr_user && events.length > 0) {
     // if (isEventOrganizer) {
     //   // Organizers view their own posts
     //   setUserPosts(events.filter(event => event.publisherId === curr_user._id));
     // } else {
    //    // Ordinary users view posts they like
    //    setUserPosts(events.filter(event => curr_user.likedPosts.includes(event._id)));
    //  }
   // }
 // }, [curr_user, events, isEventOrganizer]);

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
                  <VStack>
                    {/* user: The number of user likes; event organizer: nothing */}
                    <Text fontSize="2xl" fontWeight="bold" color="black">2</Text>
                    {/* user: nothing; event organizer: likes */}
                    <Text fontSize="lg" color="black">{isEventOrganizer ? "Likes" : ""}</Text>
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
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md" color="black">
            <Text mt={2}>Post Title</Text>
            <Text mt={2}>None   None   </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md" color="black">
          <Text mt={2}>Post Title</Text>
          <Text mt={2}>None   None   </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md" color="black">
          <Text mt={2}>Post Title</Text>
          <Text mt={2}>None   None   </Text>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
}

export default ProfilePage
