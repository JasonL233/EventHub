import React, { useState, useEffect } from 'react'
import { HStack, VStack, Box, Button, Textarea, Spacer, Text, Image, Portal } from '@chakra-ui/react';
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';
import Reply from './Reply';


const CommentCard = ({event, commentState, setCommentState }) => {
    const bgColor = "gray.150";
    const currUser = useUserStore((state) => state.curr_user); // current user
    const openLogin = useDialogStore((state) => state.openLogin); // login prompt
    const {fetchComments, comments} = useEventStore(); // Reply other comments

    const {fetchUser, user} = useUserStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    let headComment = [];
    let childComment = {};
    const [userDic, setUserDic] = useState({});
    let dialogOpen = false;
    let curId = "";
    
    useEffect(() => {
        if (event._id != null) {
            fetchComments(event._id);
        }
        setIsDialogOpen(false);
        setCommentState(false);
    }, [curId, event.comments, commentState, fetchComments, fetchUser]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (comments != null) {
                for (let comment of comments) {
                    console.log(comment.userId);
                    if (comment.userId != null) {
                        const respond = await fetch(`/api/users/${comment.userId}`);
                        const data = await respond.json();
                        setUserDic(prev => ({
                            ...prev,
                            [String(comment._id)]: {
                                username: data.data.username,
                                profileImage: data.data.profileImage
                            }
                        }));
                        /*
                        await fetchUser(comment.userId).then(
                            setUserDic(prev => ({
                                ...prev,
                                [String(comment._id)]: {
                                    username: user.username,
                                    profileImage: user.profileImage
                                }
                            }))
                        ).then(
                            console.log(comment),
                            console.log(comment._id),
                            console.log(userDic[String(comment._id)])
                        );*/
                    }
                    
                }
            }
        };

        fetchUsers();
    }, [comments]);

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

    const handleReply = () => {
        setIsDialogOpen(true);
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
                            {userDic[String(head._id)] && (
                                <Image
                                    src={userDic[String(head._id)].profileImage} 
                                    shadow={"md"} 
                                    border="black"
                                    borderRadius={"full"} 
                                    boxSize={"70px"}
                                    objectFit={"cover"}
                                    alignSelf={"flex-start"}
                                />
                            )} 
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
                                {userDic[String(head._id)] && (
                                    userDic[String(head._id)].username + ":"
                                )}
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
                            {!dialogOpen && <Reply event={event} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} commentState={commentState} setCommentState={setCommentState} target={head._id}/>}
                            {!dialogOpen == isDialogOpen && (dialogOpen = true)}
                        </VStack>
                    </HStack>
                </Box>
            ))}
        </>
        
    )
}

export default CommentCard