import React, { useState } from "react";
import { Box, Button, Container, Flex, Input, Textarea, VStack, Image, Text } from "@chakra-ui/react";

const CreatePage = () => {
  const [title, setTitle] = useState(""); // title
  const [description, setDescription] = useState(""); // description
  const [coverImage, setCoverImage] = useState(null); // cover image

  // prompts user to input an image URL and updates the state
  const handleImageUpload = () => {
    const imageUrl = prompt("Please enter the cover image URL:"); // popup input box
    if (imageUrl) {
      setCoverImage(imageUrl); // updated cover image
      alert("Cover image updated!");
    }
  };

  // process submissions
  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !coverImage) {
      alert("Please complete all fields before submitting!");
      return;
    }

    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Cover Image:", coverImage);
    alert("Submission successful!");
  };

  return (
    <Container maxW="100%" height="100%" bg="white" p={6} boxShadow="lg">
      {/* Cover Picture*/}
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
          {coverImage ? (
            <Image src={coverImage} alt="Cover" width="100%" height="100%" objectFit="cover" borderRadius="md" />
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          border="1px solid gray"
          color="black"
          width="100%"
          mb={2}
        />

        {/* Description Input */}
        <Textarea
          placeholder="Write your description here!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        isDisabled={!title.trim() || !description.trim() || !coverImage}
        mt={4}
      >
        Post
      </Button>
    </Container>
  )
}

export default CreatePage