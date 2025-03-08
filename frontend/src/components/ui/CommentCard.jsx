import React, { useState, useRef, useEffect } from 'react'
import { HStack, VStack, Box, Button, Textarea, Spacer, Text } from '@chakra-ui/react';
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';
import { toaster } from "./toaster";

const CommentCard = ({event}) => {
    const bgColor = "gray.150";
    const user = useUserStore((state) => state.curr_user); // current user
    const openLogin = useDialogStore((state) => state.openLogin); // login prompt
    const {replyComment} = useEventStore(); // Reply other comments

    const [userComment, setUserComment] = useState(""); // store user's current comment
    const [isPost, setIsPost] = useState(false);

    const [comments, setComments] = useState(event.comments);
    let headComment = [];
    let childComment = {};
    
    useEffect(() => {
        if (event) {
            setComments(event.comments);
        }
    }, [comments, event]);

    const sortComment = () => {
        if (event.comments != null) {
            for (let comment of event.comments) {
                childComment[String(comment._id)] = [];
                if (comment.replyTo === null) {
                    headComment.push(comment);
                } else {
                    childComment[String(String(comment.replyTo))].push(comment);
                }
            }
        }
    };

    return (
        <>
            {sortComment()}
            {headComment.map((head) => (
                <Box
                    key = {head._id}
                    w = {"full"} 
                    bg = {bgColor} 
                    p = {6} 
                    rounded = {"lg"} 
                    shadow = {"md"}
                    border={"black"}
                >
                    <HStack>
                        <VStack>
                        {/*Display user info*/}

                        </VStack>
                        <VStack>
                        {/*Display user comment to the post*/}
                            <Text
                                fontSize={"30"}
                                bgClip={"text"}
                                textAlign={"left"}
                                color={"black"}
                                whiteSpace={"pre-line"}
                                alignSelf={"flex-start"}
                            >
                                {head.comment}
                            </Text>
                        </VStack>
                    </HStack>
                    
                    
                </Box>
            ))}
        </>
        
    )
}

export default CommentCard