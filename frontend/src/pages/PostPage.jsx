import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { create } from "zustand";
import {VStack, Text, Container, Heading, Button, Box} from "@chakra-ui/react";


const PostPage = () => {
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

  })
  return (
    <Container maxW = 'container.x1' py = {12}>
      <VStack spacing = {8}>
        <Heading as = {"h1"} size = {"2xl"} textAlign = {"center"} mb = {8}>
					Title
				</Heading>
        <Box w = {"full"} bg = {"gray.800"} p = {6} rounded = {"lg"} shadow = {"md"}>
          Image
        </Box>
        <Box w = {"full"} bg = {"gray.800"} p = {6} rounded = {"lg"} shadow = {"md"}>
          <Text
            fontSize = {"30"}
            bgClip = {"text"}
            textAlign = {"left"}
            color = {"white"}
          >
            According to Dally Messenger and Alain de Botton, in most Western countries the values and ideals articulated in both church and civil ceremonies are generally similar. The difference is in what Messenger calls the "supernatural infrastructure" or de Botton the "implausible supernatural element".[2][3]

Most religions claim some extra advantage conferred by the deity, e.g., Roman Catholics believe that through the words of consecration in the mass ceremony, God himself becomes actually present on the altar.

Both religious and civil ceremonies share the powerful psychological, social and cultural influences which all ceremony seeks to attain. The style of music played, words used, other components and the structure vary.
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
