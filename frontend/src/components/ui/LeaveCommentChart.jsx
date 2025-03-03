import React, { useState, useEffect, useRef } from 'react'
import { HStack, VStack, Text, Input, Container, Box, Image, Button, Textarea } from '@chakra-ui/react';
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { useDialogStore } from '../../store/dialog';

const LeaveCommentChart = ({event}) => {
    const user = useUserStore((state) => state.curr_user);
    const openLogin = useDialogStore((state) => state.openLogin);
    const userPorait = "https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/05/spy-x-family-anyas-classic-meme-face-heh.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5";
    const message = "Post your comment";
    let userComment = "";


    return (
        <HStack >
            {user && (
                <Image 
                    src={userPorait} 
                    shadow={"md"} 
                    border="black" 
                    borderRadius={"full"} 
                    boxSize={"100px"}
                    objectFit={"cover"}
                    alignSelf={"flex-start"}
                />
            )}
            
            <VStack w={"full"} h={300}>
                {user && (
                    <Textarea
                        value={userComment}
                        w={"full"}
                        rows={100}
                        resize={"none"}
                        placeholder={message}
                        color={"black"}
                        border={"transparent"}
                    />
                )}
                <Button
                    style={{ 
                        border: 'black', 
                        background: 'black', 
                        cursor: 'pointer', 
                        fontSize: '24px', 
                        color: 'white',
                        alignSelf: 'end'
                        }}
                >
                    Post
                </Button>
            </VStack>
        </HStack>
    );
}

export default LeaveCommentChart