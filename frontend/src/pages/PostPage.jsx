import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { create } from "zustand";
import {VStack, Text, Container, Heading, Button, Box, Image} from "@chakra-ui/react";
import {useEventStore} from "../store/event.js";


const PostPage = () => {
  const {fetchEvent, event} = useEventStore();
  const { id } = useParams();
  

  useEffect(() => {
    fetchEvent(id);
  }, [fetchEvent]);

  console.log("Event: ", event);

  let usersComments = event.comments;

  return (
    <Container maxW = 'container.x1' py = {12}>
      <VStack spacing = {8}>
        <Heading as = {"h1"} color = {"black"} size = {"2xl"} textAlign = {"center"} mb = {8}>
          {event.title}
				</Heading>
        <Image src={event.image} width="100%" height="100%" objectFit='cover' border="black" borderColor="black"/>
        <Box w = {"full"} bg = {"gray.800"} p = {6} rounded = {"lg"} shadow = {"md"}>
          <Text
            fontSize = {"30"}
            bgClip = {"text"}
            textAlign = {"left"}
            color = {"white"}
          >
            {event.description}
          </Text>
        </Box>
        <Box w = {"full"} bg = {"gray.800"} p = {6} rounded = {"lg"} shadow = {"md"}>
          Comments
        </Box>
      </VStack>
    </Container>
  )
}

export default PostPage
