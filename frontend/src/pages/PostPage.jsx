import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { create } from "zustand";
import {VStack, Text, Container, Heading, Button, Box, Image, HStack} from "@chakra-ui/react";
import {useEventStore} from "../store/event.js";
import AutoLikeButton from '../components/ui/AutoLikeButton.jsx';
import { useUserStore } from '../store/user.js';
import { useDialogStore } from '../store/dialog.js';

const PostPage = () => {
  const {fetchEvent, event} = useEventStore();
  // Get event id
  const { id } = useParams();
  // Get current user
  const [curUser, setCurUser] = useState(useUserStore((state) => state.curr_user));

  // fetch event data
  useEffect(() => {
    fetchEvent(id);
  }, [curUser, fetchEvent]);

  let usersComments = event.comments;

  return (
    <Container maxW = 'container.x1' py = {12}>
      <VStack spacing = {8}>
        <Heading as = {"h1"} color = {"black"} size = {"2xl"} textAlign = {"center"} mb = {8}>
          {event.title}
				</Heading>
        <AutoLikeButton event = {event}/>
        <HStack>
          <Image 
            src={event.mediaUrl} 
            width="100%" 
            rounded={"lg"} 
            height="100%" 
            shadow={"md"} 
            objectFit='cover' 
            border="black" 
            borderColor="black"
          />
        </HStack>
        <Text
          fontSize = {"40"}
          bgClip = {"text"}
          textAlign = {"left"}
          color = {"black"}
          whiteSpace = {"pre-line"}
          shadow={"md"}
          rounded={"lg"}
          p={3}
        >
          {event.description}
        </Text>
        <Box w = {"full"} bg = {"gray.800"} p = {6} rounded = {"lg"} shadow = {"md"}>
          Comments
        </Box>
      </VStack>
    </Container>
  )
}

export default PostPage
