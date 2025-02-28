import React, { useState } from "react";
import { Box, Button, Container, Flex, Input, Textarea, VStack, Image, Text } from "@chakra-ui/react";
import { useEventStore } from "../store/event";
import { toaster } from "../components/ui/toaster"
import { useUserStore } from '../store/user';
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const currUser = useUserStore((state) => state.curr_user);
  // State to manage event details: title, description, and cover image
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: null,
    publisherId: currUser._id,
  });


  // Prompt the user to enter an image URL and update the state
  const handleImageUpload = () => {
    const imageUrl = prompt("Please enter the cover image URL:"); // Popup input box
    if (imageUrl) {
      setNewEvent(prevState => ({ ...prevState, image: imageUrl })); // Updated cover image
      alert("Cover image updated!");
    }
  };

  const { createEvent } = useEventStore();
  const navigate = useNavigate(); // Initialize navigate function

  // Handle form submission
  const handleSubmit = async () => {
    // console.log("Title:", newEvent.title);
    // console.log("Description:", newEvent.description);
    // console.log("Cover Image:", newEvent.image);
    const { success, message } = await createEvent(newEvent);
    console.log("Submit Result:", success, message);
    if (!success) {
      toaster.create({
        title: "Error",
        description: message,
        status: "error",
        isCloseable: true,
      });
    }
    else {
      toaster.create({
        title: "Success",
        description: message,
        status: "success",
        isCloseable: true,
      });
    }
    setNewEvent({ title: "", description: "", image: null });

    setTimeout(() => {
      navigate("/"); // Redirect to main page after 1 second
    }, 10);
  };

  return (
    <Container maxW="100%" height="100%" bg="white" p={6} boxShadow="lg">
      {/* Cover Picture */}
      <Box width="30%" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color="black" mb={2}>
          Cover Picture
        </Text>
        <Flex
          align="center"
          justify="center"
          border="2px dashed gray"
          borderRadius="md"
          width="100%"
          height="180px"
          cursor="pointer"
          onClick={handleImageUpload} // Click to upload image
        >
          {newEvent.image ? (
            <Image src={newEvent.image} alt="Cover" width="100%" height="100%" objectFit="cover" borderRadius="md" />
          ) : (
            <Box fontSize="2xl" color="gray.500">+</Box>
          )}
        </Flex>
      </Box>

      {/* Content - Below cover picture */}
      <Box width="100%">
        <Text fontSize="xl" fontWeight="bold" color="black" mb={2}>
          Content
        </Text>

        {/* Title Input */}
        <Input
          placeholder="Write your title here!"
          value={newEvent.title}
          onChange={(e) => setNewEvent(prevState => ({ ...prevState, title: e.target.value }))} // Update title in state
          border="1px solid gray"
          color="black"
          width="100%"
          mb={2}
        />

        {/* Description Input */}
        <Textarea
          placeholder="Write your description here!"
          value={newEvent.description}
          onChange={(e) => setNewEvent(prevState => ({ ...prevState, description: e.target.value }))} // Update description in state
          border="1px solid gray"
          color="black"
          width="100%"
          height="160px"
        />
      </Box>

      {/* Post Button */}
      <Button
        colorScheme="green"
        onClick={handleSubmit}
        mt={4}
      >
        Post
      </Button>
    </Container>
  )
}

export default CreatePage