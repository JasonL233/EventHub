import React, { useState, useEffect } from 'react'
import { HStack, VStack, Box, Button, Textarea, Spacer, Text, Image } from '@chakra-ui/react';
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';
import { toaster } from "./toaster";
import { get } from 'mongoose';


const CommentCard = ({event, commentState, setCommentState}) => {
    const bgColor = "gray.150";
    const currUser = useUserStore((state) => state.curr_user); // current user
    const openLogin = useDialogStore((state) => state.openLogin); // login prompt
    const {fetchComments, comments} = useEventStore(); // Reply other comments

    const {fetchUser, user} = useUserStore();
    const [userComment, setUserComment] = useState(""); // store user's current comment
    const [isPost, setIsPost] = useState(false);

    let headComment = [];
    let childComment = {};
    let curId = "";
    
    useEffect(() => {
        if (event._id) {
            fetchComments(event._id);
        }
        if (curId != "") {
            fetchUser(curId);
        }
        console.log(commentState);
        console.log(comments);
        setCommentState(false);
    }, [event.comments, curId, commentState, fetchComments]);

    const sortComment = () => {
        headComment = [];
        childComment = {};
        if (comments != null) {
            for (let comment of comments) {
                childComment[String(comment._id)] = [];
                if (comment.replyTo === null) {
                    headComment.push(comment);
                } else {
                    childComment[String(String(comment.replyTo))].push(comment);
                }
            }
        }
    };

    const handleReply = async () => {

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
                    {curId = head.userId}
                    <HStack>
                        <VStack>
                        {/*Display user info*/}
                            <Image 
                                src={user.profileImage} 
                                shadow={"md"} 
                                border="black"
                                borderRadius={"full"} 
                                boxSize={"70px"}
                                objectFit={"cover"}
                                alignSelf={"flex-start"}
                            />
                        </VStack>
                        <VStack
                            w={"full"}
                            color={"gray.300"}
                        >
                        {/*Display user comment to the post*/}
                            <Text
                                fontSize={"xl"}
                                fontWeight={"bold"}
                                bgClip={"text"}
                                textAlign={"left"}
                                color={"black"}
                                whiteSpace={"pre-line"}
                                alignSelf={"flex-start"}
                            >
                                {user.username + ":"}
                            </Text>
                            <Text
                                fontSize={"md"}
                                bgClip={"text"}
                                textAlign={"left"}
                                color={"black"}
                                whiteSpace={"pre-line"}
                                alignSelf={"flex-start"}
                            >
                                {head.comment}
                            </Text>
                            {currUser && (
                                <Button
                                    style={{ 
                                        border: 'black', 
                                        background: 'black', 
                                        cursor: 'pointer',
                                        fontSize: '24px',
                                        color: 'white',
                                        alignSelf: 'end'
                                        }}
                                    onClick={handleReply}
                                    rounded={"lg"}
                                >
                                    Reply
                                </Button>
                            )}
                        </VStack>
                    </HStack>
                </Box>
            ))}
        </>
        
    )
}

export default CommentCard