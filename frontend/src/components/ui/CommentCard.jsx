import React, { useState, useEffect } from 'react'
import { HStack, VStack, Box, Button, Textarea, Spacer, Text, Image, Portal } from '@chakra-ui/react';
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';
import Reply from './Reply';
import CommentDetail from './CommentDetail';


const CommentCard = ({event, commentState, setCommentState }) => {
    const bgColor = "gray.150";
    const currUser = useUserStore((state) => state.curr_user); // current user
    const openLogin = useDialogStore((state) => state.openLogin); // login prompt
    const {fetchComments, comments} = useEventStore(); // Reply other comments

    const {fetchUser, user} = useUserStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [commentDetail, setCommentDetail] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [targetComment, setTargetComment] = useState();

    let headComment = [];
    let childComment = {};
    const [userDic, setUserDic] = useState({});
    let dialogOpen = false;
    let showDetail = false;
    let curId = "";
    
    useEffect(() => {
        if (event._id != null) {
            fetchComments(event._id);
        }
        setCommentDetail(false);
        setIsDialogOpen(false);
        setCommentState(false);
    }, [curId, event.comments, commentState, fetchComments, fetchUser]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (comments != null) {
                for (let comment of comments) {
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

    const handleReply = async (e, head) => {
        e.stopPropagation();
        setClicked(true);
        if (currUser) {
            setTargetComment(head);
            setIsDialogOpen(true);
        } else {
            openLogin();
        }
    };

    const handleAvatarClick = () => {
        
    };

    const handleBox = async (head) => {
        if (clicked) {
            setClicked(false);
        } else {
            setTargetComment(head);
            setCommentDetail(true);
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
                    _hover={{
                        backgroundColor: 'gray.200'
                    }}
                    cursor={'pointer'}
                    onClick={() => {handleBox(head)}}
                >
                    <HStack>
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
                                onClick={handleAvatarClick}
                            />
                        )}
                        <VStack
                            w={"full"}
                            >
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
                            </VStack>
                            <Button
                                style={{ 
                                    border: 'black', 
                                    background: 'black', 
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    color: 'white',
                                    alignSelf: 'end'
                                    }}
                                onClick={(e, head) => handleReply(e, head)}
                                rounded={"lg"}
                            >
                                Reply
                            </Button>
                            {!showDetail && <CommentDetail isDialogOpen={commentDetail} setIsDialogOpen={() => setCommentDetail(false)} comment={targetComment} replies={childComment} userDict={userDic}  />}
                            {!showDetail == commentDetail && (showDetail = true)}
                            {!dialogOpen && <Reply event={event} isDialogOpen={isDialogOpen} setIsDialogOpen={() => setIsDialogOpen(false)} commentState={commentState} setCommentState={setCommentState} target={targetComment}/>}
                            {!dialogOpen == isDialogOpen && (dialogOpen = true)}
                        </VStack>
                        
                    </HStack>
                    
                </Box>
            ))}
            
        </>
        
    )
}

export default CommentCard