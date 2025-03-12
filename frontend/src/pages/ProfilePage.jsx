import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/user';
import { useEventStore } from '../store/event';
import { useParams } from 'react-router-dom';
import { Box, Container, Heading, Image, Text, VStack, Grid, GridItem, Button, Input} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { postContainerStyle, postTextStyle, postTitleStyle } from '../components/ui/ProfileLikePostStyle';

const ProfilePage = () => {
  const { id } = useParams();   // Get the ID from URL
  const curr_user = useUserStore((state) => state.curr_user);
  const {events, fetchEvents} = useEventStore();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  // State to store liked events and posted events (for event organizers)
  const [likedevents, setLikedevents] = useState([]);
  const [organizerPosts, setOrganizerPosts] = useState([]);
  
  const [isFollowing, setIsFollowing] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(curr_user?.username || "");
  const [newProfileImage, setNewProfileImage] = useState(curr_user?.profileImage || "https://static.thenounproject.com/png/5034901-200.png");
  const { fetchUser, updateUserProfile, updateFollow} = useUserStore();

  {/* If currUser exists, directly get currUser.isEventOrganizer.
      If currUser is empty (not logged in), 
      the default value is false to prevent errors caused by undefined. */}
  let isEventOrganizer = false;  // Set the isEventOrganizer is false
  if (curr_user) {
    isEventOrganizer = Boolean(curr_user.isEventOrganizer);
  }

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
  const UpdateUsername = async() => {
    if(!isMyProfile) return;  // Prevent updating other users

    const updateUserInfo = await updateUserProfile(profileUser._id, newUsername, profileUser.profileImage);
    if(updateUserInfo){
      setProfileUser((prev) => ({
        ...prev,
        username: updateUserInfo.username,  // Only update username
      })); 
      useUserStore.setState((state) => ({
        curr_user: {
          ...state.curr_user,
          username: updateUserInfo.username,   // Ensure Zustand update
        },
      }));
    }
    setIsEditing(false);    // Exist editing model
  };

  const UpdateProfileImage = async (imageURL) => {
    if(!isMyProfile || !imageURL) return;  // Prevent updating other users

    setNewProfileImage(imageURL);

    const updateUserInfo = await updateUserProfile(profileUser._id, profileUser.username, imageURL);
    if(updateUserInfo){
      setProfileUser((prev) => ({
        ...prev,
        profileImage: updateUserInfo.profileImage,  // Only update profile image
      }));
      useUserStore.setState((state) => ({
        curr_user: {
          ...state.curr_user,
          profileImage: updateUserInfo.profileImage, // Ensure Zustand update
        },
      }));
    }
  };

  useEffect(() => {
    if (profileUser && curr_user){
      setIsFollowing(curr_user.following.includes(profileUser._id));
    }
  }, [curr_user, profileUser]);    // Listen to `following` and `followers` changes

  // Handle follow/unfollow
  const handleFollow = async() => {
    if(!curr_user || !profileUser)
      return;

    const newIsFollowing = !isFollowing; // First calculate the new isFollowing state
    setIsFollowing(newIsFollowing);

    // Call a single updateFollow interface
    const res = await updateFollow(curr_user._id, profileUser._id, newIsFollowing);
    if(res.success){
      const updatedFollowers = res.data.targetUser.followers;
      setProfileUser((pre_ProfileUser) => ({
        ...pre_ProfileUser,
        followers: updatedFollowers,
      }));
    } 
  };
  
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
                      UpdateProfileImage(imageURL);
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
                          <Button colorScheme="blue" onClick={UpdateUsername}>Save</Button>
                       </GridItem>
                        <GridItem>
                          <Button colorScheme="gray" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </GridItem>
                      </Grid>
                    )}
                  </GridItem>
                </Grid>
                <Text fontSize="xl" color="black">ID: {profileUser?._id}</Text>
                {/* The counter of followers and following*/}
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  {profileUser.isEventOrganizer ? (
                    <VStack>
                      <Text fontSize="2xl" fontWeight="bold" color="black">{profileUser.followers?.length || 0}</Text>
                      {/* event organizer: followers */}
                      <Text fontSize="lg" color="black">Followers</Text>
                    </VStack>
                  ) : (
                    <VStack>
                      <Text fontSize="2xl" fontWeight="bold" color="black">{profileUser.following?.length || 0}</Text>
                      {/* user: following */}
                      <Text fontSize="lg" color="black">Following</Text>
                    </VStack>
                  )}
                </Grid>
                {/* the follow and unfollow button */}
                {!isMyProfile && (
                  <Button 
                  bg={isFollowing ? "gray.200" : "black"}
                  color={isFollowing ? "black" : "white"}
                  onClick={handleFollow}
                  transition="transform 0.2s ease-in-out"
                  _hover={{
                    transform: "translateY(-2px) scale(1.05)",
                    bg: isFollowing ? "gray.300" : "blue.600",
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
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
                <GridItem key={event._id} {...postContainerStyle} onClick={() => navigate(`/post/${event._id}`)}>
                  <VStack align="start">
                    <Heading {...postTitleStyle}>{event.title}</Heading>
                    <Text {...postTextStyle}>{truncatedDescription}</Text>
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
              <GridItem key={event._id} {...postContainerStyle} onClick={() => navigate(`/post/${event._id}`)}>
                <VStack align="start">
                  <Heading {...postTitleStyle}>{event.title}</Heading>
                  <Text {...postTextStyle}>{event.description.split(/[.\n]/)[0] + "..."}</Text>
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