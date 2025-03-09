import React, { useState, useEffect, useRef } from 'react'
import { Button, Textarea, Box, Text, Portal, VStack, HStack, Image } from '@chakra-ui/react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "./dialog"
import Reply from './Reply';
import { useUserStore } from '../../store/user';
import { RxCross1 } from "react-icons/rx";

const CommentDetail = ({ isDialogOpen, setIsDialogOpen, comment, replies, userDict, }) => {
    const bgColor = "gray.150";
    const currUser = useUserStore((state) => state.curr_user); // current user
    const dialogRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                setIsDialogOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDialogOpen, setIsDialogOpen]);

    const handlePost = () => {

    };

    const handleAvatarClick = () => {

    };

    if (!isDialogOpen) return null;

    return (
        <Portal>
            {console.log(comment._id)}
            <DialogRoot ref={dialogRef} placement={"center"} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <Button
                        style={{ 
                            border: 'black', 
                            cursor: 'pointer',
                            fontSize: '24px',
                            alignSelf: 'end',
                            backgroundColor: 'transparent'
                        }}
                        onClick={() => setIsDialogOpen(false)}
                    >
                        <RxCross1 
                            style={{ 
                                border: 'black', 
                                cursor: 'pointer',
                                fontSize: '24px',
                                color: 'black',
                                alignSelf: 'end',
                                scale: 2
                            }}
                        />
                    </Button>
                    <DialogHeader>
                        <DialogTitle>
                            <Text
                                fontSize={"xl"}
                                fontWeight={"bold"}
                                bgClip={"text"}
                                textAlign={"left"}
                                color={"black"}
                                whiteSpace={"pre-line"}
                                alignSelf={"flex-start"}
                            >
                                Comment Details
                            </Text>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <DialogBody>
                        <VStack>
                            <Box
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
                            >
                                <HStack>
                                    {userDict[String(comment._id)] && (
                                        <Image
                                            src={userDict[String(comment._id)].profileImage} 
                                            shadow={"md"} 
                                            border="black"
                                            borderRadius={"full"} 
                                            boxSize={"70px"}
                                            objectFit={"cover"}
                                            alignSelf={"flex-start"}
                                            onClick={handleAvatarClick}
                                        />
                                    )}
                                    <VStack w={"full"} color={"gray.300"}>
                                        <Text
                                            fontSize={"xl"}
                                            fontWeight={"bold"}
                                            bgClip={"text"}
                                            textAlign={"left"}
                                            color={"black"}
                                            whiteSpace={"pre-line"}
                                            alignSelf={"flex-start"}
                                        >
                                            {userDict[String(comment._id)] && (
                                                userDict[String(comment._id)].username + ":"
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
                                            {comment.comment}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                            {replies[String(comment._id)].map((head) => (
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
                                >
                                    <HStack>
                                        {userDict[String(head._id)] && (
                                            <Image
                                                src={userDict[String(head._id)].profileImage} 
                                                shadow={"md"} 
                                                border="black"
                                                borderRadius={"full"} 
                                                boxSize={"70px"}
                                                objectFit={"cover"}
                                                alignSelf={"flex-start"}
                                                onClick={handleAvatarClick}
                                            />
                                        )}
                                        <VStack w={"full"} color={"gray.300"}>
                                            <Text
                                                fontSize={"xl"}
                                                fontWeight={"bold"}
                                                bgClip={"text"}
                                                textAlign={"left"}
                                                color={"black"}
                                                whiteSpace={"pre-line"}
                                                alignSelf={"flex-start"}
                                            >
                                                {userDict[String(head._id)] && (userDict[String(head._id)].username + ":")}
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
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    </DialogBody>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </Portal>
    );
}

export default CommentDetail