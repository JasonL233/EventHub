import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/user';
import { useEventStore } from '../store/event';
import { Box, Container, Heading, Image, Text, VStack, Grid, GridItem, Button, Input} from "@chakra-ui/react";
import EventCard from "../components/ui/EventCard"; // Ensures EventCard components has been imported

const ProfilePage = () => {
  const curr_user = useUserStore((state) => state.curr_user);
  const {events, fetchEvents} = useEventStore();

  // State to store liked events and posted events (for event organizers)
  const [likedevents, setLikedevents] = useState([]);
  const [organizerPosts, setOrganizerPosts] = useState([]); 

  const [countOfFollowing, setFollowingcount] = useState(curr_user?.following?.length || 0);
  const [countOfFollowers, setFollowerscount] = useState(curr_user?.followers?.length || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(curr_user?.username || "");
  const [newProfileImage, setNewProfileImage] = useState(curr_user?.profileImage || "https://cdn.kinocheck.com/i/tw5o2a0n6a.jpg");
  const { updateUserProfile } = useUserStore();

  // Handle update
  const Updatename_profile = async() => {
    await updateUserProfile(curr_user._id, newUsername, newProfileImage);
    setIsEditing(false);    // Exist editing model
  };

  useEffect(() => {
    if (curr_user){
      setFollowingcount(curr_user.following.length);   // Update following counts
      setFollowerscount(curr_user.followers.length);   // Update followers counts
    }
  }, [curr_user?.following, curr_user?.followers]);    // Listen to `following` and `followers` changes
  
  useEffect(() => {
    if (curr_user) {
      fetchEvents(); // Ensure all event data is fetched
    }
  }, [curr_user]); // Ensures when curr_user changes, update the data

  useEffect(() => {
    if (curr_user && events.length > 0) {
      // Upadate liked events in real-time
      setLikedevents(events.filter(event => curr_user.likedPosts.includes(event._id)));

      // If the user is an event organizer, update their posted events
      if (curr_user.isEventOrganizer) {
        setOrganizerPosts(events.filter(event => event.publisherId === curr_user._id));
      }
    }
  }, [curr_user?.likedPosts, events]);  // Depend on likedPosts and events to ensure real-time updates

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
              {/* Profile Picture(allow edit) */}
              <Image
                borderRadius="full"
                boxSize="200px"
                src={newProfileImage || curr_user.profileImage}
                alt="User Avatar"
                onClick={() => {
                  const imageURL = prompt("Please enter a new profile image URL: ");
                  if (imageURL){
                    setNewProfileImage(imageURL);
                  }
                }}
                cursor="pointer"
              />
            </GridItem>
            <GridItem colSpan={4}>
            <VStack align="start" width="100%">
              <Grid templateColumns="repeat(5, auto)" alignItems="center" gap={2}>
                <GridItem colSpan={4}>
                  {/* User Name (allow edit) and ID */}
                    {!isEditing ? (
                      <Heading size="2xl" color="black">{curr_user.username}</Heading>
                    ) : (
                      <Input
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Please enter a new username: "
                        size="md"
                        color="black"
                      />
                    )}
                </GridItem>
                <GridItem>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                  ) : (
                    <Grid templateColumns="repeat(2, auto)" gap={2}>
                      <GridItem>
                        <Button colorScheme="blue" onClick={Updatename_profile}>Save</Button>
                      </GridItem>
                      <GridItem>
                        <Button colorScheme="gray" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </GridItem>
                    </Grid>
                  )}
                  </GridItem>
                </Grid>
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
