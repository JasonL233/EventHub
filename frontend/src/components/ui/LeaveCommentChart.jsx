import React, { useState, useRef } from 'react'
import { HStack, VStack, Image, Button, Textarea, Spacer } from '@chakra-ui/react';
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';
import { toaster } from "./toaster";

const LeaveCommentChart = ({event}) => {
    const user = useUserStore((state) => state.curr_user); // current user
    const openLogin = useDialogStore((state) => state.openLogin); // login prompt
    const {addComment} = useEventStore(); // upload comment
    // Default Avatar
    const promptMessage = "Post your comment"; // Message displayed in comment prompt
    const [userComment, setUserComment] = useState(""); // store user's current comment
    const [isPost, setIsPost] = useState(false); // Check if user post comment

    const handlePost = async () => {
        // if user login then upload comment
        if (user) {
            // if user didn't upload empty comment
            if (userComment !== "") {
                const {success, message} = await addComment(event._id, user._id, userComment);

                // if failing upload comment 
                if (!success) {
                    toaster.create({
                        title: "Error",
                        description: message,
                        type: "error",
                        duration: 1500,
                        isCloseable: true
                    });
                } else { // reset input
                    setUserComment("");
                    return;
                }
            } else { // if empty comment, do nothing
                return;
            }
        } else { // Other wise pop login prompt
            openLogin();
        }
    };

    const handleLogin = async () => {
        if (!user) {
            openLogin();
        }
    };

    return (
        <HStack >
            {user && (
                <Image 
                    src={user.profileImage} 
                    shadow={"md"} 
                    border="black"
                    borderRadius={"full"} 
                    boxSize={"100px"}
                    objectFit={"cover"}
                    alignSelf={"flex-start"}
                />
            )}

            {!user && (<Spacer></Spacer>)}
            {!user && (
                        <Button
                          color={'black'}
                          cursor={'pointer'}
                          fontWeight={'bold'}
                          fontSize={20}
                          backgroundColor={'transparent'}
                          textAlign={'center'}
                          transition={"0.3s"}
                          _hover={{
                            fontSize: 30,
                            backgroundColor: 'gray.300'
                          }}
                          rounded={'lg'}
                          onClick={handleLogin}
                        >
                          Please Login To Comment This Post
                        </Button>
            )}
            {!user && (<Spacer></Spacer>)}

            <VStack w={user ? "full" : 0} h={150} color={"gray.300"}>
                {user && (
                    <Textarea
                        value={userComment}
                        onChange={
                            (text) => setUserComment(text.target.value)
                        }
                        w={"full"}
                        rows={50}
                        resize={"none"}
                        placeholder={promptMessage}
                        _placeholder={{ 
                            color: "gray.500",
                            fontSize: 20,
                        }}
                        color={"black"}
                        border={"transparent"}
                    />
                )}
                {user && (
                    <Button
                        style={{ 
                            border: 'black', 
                            background: 'black', 
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: 'white',
                            alignSelf: 'end'
                            }}
                        onClick={handlePost}
                        rounded={"lg"}
                    >
                        Post
                    </Button>
                )}
            </VStack>
        </HStack>
    );
}

export default LeaveCommentChart