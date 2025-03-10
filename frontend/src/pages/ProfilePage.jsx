import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/user';
import { useEventStore } from '../store/event';
import { useParams } from 'react-router-dom';
import { Box, Container, Heading, Image, Text, VStack, Grid, GridItem, Button, Input} from "@chakra-ui/react";
import EventCard from "../components/ui/EventCard"; // Ensures EventCard components has been imported

const ProfilePage = () => {
  const { id } = useParams();   // Get the ID from URL
  const curr_user = useUserStore((state) => state.curr_user);
  const {events, fetchEvents} = useEventStore();

  const [profileUser, setProfileUser] = useState(null);
  // State to store liked events and posted events (for event organizers)
  const [likedevents, setLikedevents] = useState([]);
  const [organizerPosts, setOrganizerPosts] = useState([]); 

  const [countOfFollowing, setFollowingcount] = useState(curr_user?.following?.length || 0);
  const [countOfFollowers, setFollowerscount] = useState(curr_user?.followers?.length || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(curr_user?.username || "");
  const [newProfileImage, setNewProfileImage] = useState(curr_user?.profileImage || "https://static.thenounproject.com/png/5034901-200.png");
  const { fetchUser, updateUserProfile  } = useUserStore();

  let isMyProfile = false;
  if(!id || id === curr_user?._id){
    isMyProfile = true;
  }

  // Pull the user info. we want to access
  useEffect(() => {
    if(isMyProfile){
      setProfileUser(curr_user);
    }else{
      const fetchUserProfile = async() => {
        const user = await fetchUser(id);  // Fetch other user's profile
        setProfileUser(user);
      };
      fetchUserProfile();
    }
  }, [id, curr_user]);

  // Handle update
  const Updatename_profile = async() => {
    if(!isMyProfile) return;  // Prevent updating other users

    const updateUserInfo = await updateUserProfile(profileUser._id, newUsername, newProfileImage);
    if(updateUserInfo){
      setProfileUser(updateUserInfo);  // Ensure UI reflects changes
    }
    setIsEditing(false);    // Exist editing model
  };

  useEffect(() => {
    if (curr_user){
      setFollowingcount(curr_user.following.length);   // Update following counts
      setFollowerscount(curr_user.followers.length);   // Update followers counts
    }
  }, [curr_user?.following, curr_user?.followers]);    // Listen to `following` and `followers` changes
  
  useEffect(() => {
    if (profileUser) {
      setNewUsername(profileUser.username);
      setNewProfileImage(profileUser.profileImage);
      fetchEvents(); // Ensure all event data is fetched
    }
  }, [profileUser, fetchEvents]); // Ensures when curr_user changes, update the data

  useEffect(() => {
    if (profileUser && events.length > 0){

      // Upadate liked events in real-time
      setLikedevents(events.filter(event => profileUser?.likedPosts?.includes(event._id)));

      // If the user is an event organizer, update their posted events
      if (profileUser.isEventOrganizer) {
        setOrganizerPosts(events.filter(event => String(event.publisherId?._id) === String(profileUser._id)));
      }
    }
  }, [profileUser, events]);  // Depend on likedPosts and events to ensure real-time updates

  if(!profileUser)
    return <p>Loading...</p>;   // Prevents null errors


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
                src={newProfileImage || profileUser?.profileImage}
                alt="User Avatar"
                onClick={() => {
                  if(isMyProfile){
                    const imageURL = prompt("Please enter a new profile image URL: ");
                    if (imageURL){
                      setNewProfileImage(imageURL);
                    }
                  }
                }}
                cursor={isMyProfile ? "pointer" : "default"}
              />
            </GridItem>
            <GridItem colSpan={4}>
              <VStack align="start" width="100%">
                <Grid templateColumns="repeat(5, auto)" alignItems="center" gap={2}>
                  <GridItem colSpan={4}>
                    {/* User Name (allow edit) and ID */}
                    {!isEditing ? (
                      <Heading size="2xl" color="black">{profileUser?.username}</Heading>
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
                    {isMyProfile && !isEditing && (
                      <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    )}
                    {isEditing && (
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
                <Text fontSize="xl" color="black">ID: {profileUser?._id}</Text>
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
        <Heading size="2xl" color="black">{profileUser?.isEventOrganizer ? "Posts" : "Likes"}</Heading>
        <Box borderBottom="2px solid black" width="100%" my={4} />
      </Box>

      {/* If user is an event organizer, show their posted events with likes */}
      {profileUser?.isEventOrganizer ? (
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