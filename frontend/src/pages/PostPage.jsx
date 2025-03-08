import React, { createContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {VStack, Text, Container, Heading, Button, Box, Image, HStack} from "@chakra-ui/react";
import {useEventStore} from "../store/event.js";
import AutoLikeButton from '../components/ui/AutoLikeButton.jsx';
import { useUserStore } from '../store/user.js';
import { useDialogStore } from '../store/dialog.js';
import CommentCard from '../components/ui/CommentCard.jsx';
import LeaveCommentChart from '../components/ui/LeaveCommentChart.jsx';
import Reply from '../components/ui/Reply.jsx';

const PostPage = () => {
  const bgColor = "gray.150";
  const {fetchEvent, event} = useEventStore();
  // Get event id
  const { id } = useParams();
  // Get current user
  const curUser = useUserStore((state) => state.curr_user);

  // Check update comment
  const [commentState, setCommentState] = useState(false);


  // fetch event data
  useEffect(() => {
    fetchEvent(id);
  }, [curUser, fetchEvent]);

  return (
    <Container maxW = 'container.x1' py = {12}>
      <VStack spacing = {8}>
        <Heading as = {"h1"} color = {"black"} size = {"2xl"} textAlign = {"center"} mb = {8}>
          {event.title}
				</Heading>
        <AutoLikeButton event = {event} initial={false}/>
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
            rounded={"lg"}
          />
        )}
        <Box 
          w = {"full"} 
          bg = {bgColor} 
          p = {6} 
          rounded = {"lg"} 
          shadow = {"md"}
          border={"black"}
        >
          <Text
            fontSize = {"md"}
            bgClip = {"text"}
            textAlign = {"left"}
            color = {"black"}
            whiteSpace = {"pre-line"}
          >
            {event.description}
          </Text>

          {/* tag display */}
          {event.tags && event.tags.length > 0 && (
            <HStack mt={4} spacing={4}>
              {event.tags.map((tag, index) => (
                <Box
                  key={index}
                  bg="gray.200"
                  px={3}
                  py={1}
                  borderRadius="md"
                  border="1px solid black"
                >
                  <Text color="black" fontSize="sm">
                    {tag}
                  </Text>
                </Box>
              ))}
            </HStack>
          )}

        </Box>
        <Box 
          w = {"full"} 
          bg = {bgColor} 
          p = {6} 
          rounded = {"lg"} 
          shadow = {"md"}
          border={"black"}
        >
          <LeaveCommentChart event = {event} commentState={commentState} setCommentState={setCommentState}/>
        </Box>
        <CommentCard event = {event} commentState={commentState} setCommentState={setCommentState} />
      </VStack>
    </Container>
  );
}

export default PostPage
