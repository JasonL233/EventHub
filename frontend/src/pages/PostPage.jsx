import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import {VStack, Text, Container, Heading, Box, Image, HStack, Spacer, Button} from "@chakra-ui/react";
import {useEventStore} from "../store/event.js";
import AutoLikeButton from '../components/ui/AutoLikeButton.jsx';
import { useUserStore } from '../store/user.js';
import CommentCard from '../components/ui/CommentCard.jsx';
import LeaveCommentChart from '../components/ui/LeaveCommentChart.jsx';
import Publisher from '../components/ui/Publisher.jsx';


const PostPage = () => {
  const bgColor = "gray.150";
  const {fetchEvent, event} = useEventStore();
  // Get event id
  const { id } = useParams();
  // Get current user
  const curUser = useUserStore((state) => state.curr_user);
  // Check update comment
  const [commentState, setCommentState] = useState(false);
  // Loading state
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  // fetch event data
  useEffect(() => {
    fetchEvent(id).then(setLoading(false));
    
  }, [curUser, fetchEvent]);

  useEffect(() => {
    return () => {
      console.log("in");
        setLoading(true);
    };
  }, []);

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
  }, [event]);

  if (loading) return ;

  return (
    <Container maxW = 'container.x1' py = {12}>
      <VStack ref={containerRef}>
        <Publisher event={event}/>
        <Heading as = {"h1"} color = {"black"} size = {"4xl"} textAlign = {"center"} mb = {8}>
          {event.title}
				</Heading>
        <AutoLikeButton event = {event} initial={false}/>
        {event.eventType === "video" ? (
          <iframe
          src={event.mediaUrl}
          autoPlay
          loop
          controls
          width={'100%'}
          height={width*0.5625}
          style={{ objectFit: "cover", border: "black", borderColor: "black"}}
          />
        ) : (
          <Image
            src={event.mediaUrl}
            objectFit="contain"
            border="black"
            borderColor="black"
            rounded={"lg"}
            w="70%"
            maxH={"800px"}
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
