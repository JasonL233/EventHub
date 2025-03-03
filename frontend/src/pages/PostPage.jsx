import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {VStack, Text, Container, Heading, Button, Box, Image, HStack} from "@chakra-ui/react";
import {useEventStore} from "../store/event.js";
import AutoLikeButton from '../components/ui/AutoLikeButton.jsx';
import { useUserStore } from '../store/user.js';
import { useDialogStore } from '../store/dialog.js';
import LeaveCommentChart from '../components/ui/LeaveCommentChart.jsx';

const PostPage = () => {
  const {fetchEvent, event} = useEventStore();
  // Get event id
  const { id } = useParams();
  // Get current user
  const curUser = useUserStore((state) => state.curr_user);

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
        {event.eventType === "video" ? (
          <video
            src={event.mediaUrl}
            autoPlay
            muted
            loop
            controls
            width="100%"
            style={{ objectFit: "cover", border: "black", borderColor: "black" }}
          />
        ) : (
          <Image
            src={event.mediaUrl}
            width="100%"
            height="100%"
            objectFit="cover"
            border="black"
            borderColor="black"
          />
        )}
        <Box w = {"full"} bg = {"gray.800"} p = {6} rounded = {"lg"} shadow = {"md"}>
          <Text
            fontSize = {"30"}
            bgClip = {"text"}
            textAlign = {"left"}
            color = {"white"}
            whiteSpace = {"pre-line"}
          >
            {event.description}
          </Text>
        </Box>
        <Box w = {"full"} bg = {"white"} p = {6} rounded = {"lg"} shadow = {"md"}>
          <LeaveCommentChart event = {event}/>
        </Box>
      </VStack>
    </Container>
  );
}

export default PostPage
