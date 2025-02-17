import React from 'react'
import { Box, Container, Heading, Image, Text, VStack, Grid, GridItem} from "@chakra-ui/react";

const ProfilePage = ({ isUser }) => {
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
                src="https://cdn.kinocheck.com/i/tw5o2a0n6a.jpg"
                alt="User Avatar"
              />
            </GridItem>
            <GridItem colSpan={4}>
            <VStack align="start">
              {/* User Name and ID */}
                <Heading size="2xl">Username</Heading>
                <Text fontSize="xl" color="gray.500">ID: 123456789</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold">1</Text>
                    {/* user: following; event organizer: followers */}
                    <Text fontSize="lg">{isUser ? "Following" : "Followers"}</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold">2</Text>
                    {/* user: nothing; event organizer: likes */}
                    <Text fontSize="lg">{isUser ? "" : "Likes"}</Text>
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
        <Heading size="2xl">{isUser ? "Likes" : "Posts"}</Heading>
        <Box borderBottom="2px solid black" width="100%" my={4} />
      </Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md">
            <Text mt={2}>Post Title</Text>
            <Text mt={2}>None   None   </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md">
          <Text mt={2}>Post Title</Text>
          <Text mt={2}>None   None   </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md">
          <Text mt={2}>Post Title</Text>
          <Text mt={2}>None   None   </Text>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
}

export default ProfilePage
