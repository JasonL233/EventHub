import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Flex, Input, Textarea, Image, Text, Heading } from "@chakra-ui/react";
import { useEventStore } from "../store/event";
import { toaster } from "../components/ui/toaster";
import { useUserStore } from '../store/user';
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const currUser = useUserStore((state) => state.curr_user);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Form fields
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    eventType: "image", // Default media type
    publisherId: currUser._id,
    tags: []
  });

  // State for tag input
  const [tagInput, setTagInput] = useState("");

  const handleMediaUpload = () => {
    const mediaUrl = prompt("Please enter the media URL:");  // Popup input box
    if (mediaUrl) {
      setNewEvent(prevState => ({ ...prevState, mediaUrl }));
      alert("Media address has been updated!");
    }
  };

  const { createEvent } = useEventStore();
  const navigate = useNavigate(); // Initialize navigate function
  // console.log("Toaster Object:", toaster);

  // Submit form: send file + fields via FormData
  // Add tag when Enter is pressed in the tag input box.
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setNewEvent((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // Delete tag
  const removeTag = (indexToRemove) => {
    setNewEvent((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async () => {
    const { success, message } = await createEvent(newEvent);
    
    if (!success) {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
        duration: 1500,
        isCloseable: true,
      });
      return;
    } else {
      toaster.create({
        title: "Success",
        description: message,
        type: "success",
        duration: 1500,
        isCloseable: true,
      });
    }

    setNewEvent({ title: "", description: "", mediaUrl: "", eventType: "image", publisherId: currUser._id });

    setTimeout(() => {
      navigate("/"); // Redirect to main page after 1 second
    }, 10);
  };

  return (
    <Container maxW="100%" py={10}>
    <Box 
      p={8} 
      boxShadow="xl" 
      borderRadius="lg" 
      bg="gray.50"
      border="1px solid gray.200"
    >
        {/* Title */}
        <Heading fontSize="2xl" fontWeight="bold" color="gray.700" mb={6} textAlign="center">
          Create New Event
        </Heading>

        {/* Media Type Selection */}
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
            Select Media Type
          </Text>
          <select
            value={newEvent.eventType}
            onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid gray", color: "black" }}
          >
            <option value="image">image</option>
            <option value="video">video</option>
          </select>
        </Box>

        {/* Media Preview and Upload */}
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
            Media Preview
          </Text>
          <Flex
            align="center"
            justify="center"
            border="2px dashed gray.400"
            borderRadius="md"
            width="30%"
            height="100%"
            cursor="pointer"
            _hover={{ borderColor: "gray.600" }}
            onClick={handleMediaUpload}
            transition="0.2s"
            bg="gray.100"
            ref={containerRef}
          >
            {newEvent.mediaUrl ? (
              newEvent.eventType === "video" ? (
                <iframe
                src={newEvent.mediaUrl}
                width={'100%'}
                height={width*0.5625}
                style={{ objectFit: "cover", border: "black", borderColor: "black"}}
                >
                  Your browser does not support video playback.
                </iframe>
              ) : (
                <Image
                  src={newEvent.mediaUrl}
                  alt="Media Preview"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  borderRadius="md"
                />
              )
            ) : (
              <Text fontSize="xl" color="gray.500">+</Text>
            )}
          </Flex>
        </Box>

        {/* Content - Below cover picture */}
        <Box width="100%">
          <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
            Content
          </Text>

          {/* Title Input */}
          <Input
            placeholder="Write your title here!"
            value={newEvent.title}
            onChange={(e) => setNewEvent(prevState => ({ ...prevState, title: e.target.value }))} // Update title in state
            border="1px solid gray.300"
            borderRadius="md"
            _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
            width="100%"
            mb={3}
            height="50px"
            color="black"
            _placeholder={{ color: "gray.500" }}
          />

          {/* Description Input */}
          <Textarea
            placeholder="Write your description here!"
            value={newEvent.description}
            onChange={(e) => setNewEvent(prevState => ({ ...prevState, description: e.target.value }))} // Update description in state
            border="1px solid gray"
            borderRadius="md"
            _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
            height="200px"
            mb={4}
            color="black"
            _placeholder={{ color: "gray.500" }}
          />
        </Box>

        {/* Post Button */}
        <Box width="100%" mb={4}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
            Tags
          </Text>
          <Flex wrap="wrap" mb={2}>
            {(newEvent.tags || []).map((tag, index) => (
              <Box
                key={index}
                bg="gray.200"
                color="black"
                px={3}
                py={1}
                mr={2}
                mb={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Text>{tag}</Text>
                <Button size="xs" ml={2} onClick={() => removeTag(index)}>x</Button>
              </Box>
            ))}
          </Flex>
          <Input
            placeholder="Enter a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            border="1px solid gray.300"
            borderRadius="md"
            _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
            color="black"
            _placeholder={{ color: "gray.500" }}
          />
        </Box>

        <Button
          colorScheme="blue"
          width="100%"
          onClick={handleSubmit}
          borderRadius="md"
          fontSize="lg"
          fontWeight="bold"
          _hover={{ bg: "blue.600" }}
          transition="0.2s"
        >
          Post
        </Button>
      </Box>
    </Container>
  )
}

export default CreatePage
