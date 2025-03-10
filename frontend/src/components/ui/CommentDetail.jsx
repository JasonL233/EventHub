import React, { useState, useEffect, useRef } from 'react'
import { Button, Textarea, Box, Text, Portal, VStack, HStack, Image, Spacer } from '@chakra-ui/react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "./dialog"
import { useUserStore } from '../../store/user';
import { RxCross1 } from "react-icons/rx";

const CommentDetail = ({ isOpen, setIsOpen, comment, replies, userDict, setCommentState }) => {
    const bgColor = "gray.150";
    const currUser = useUserStore((state) => state.curr_user); // current user
    const dialogRef = useRef(null);
    const [close, setClose] = useState(!isOpen);

    useEffect(() => {
        if (close) {
            setIsOpen(false);
        } else {
            const handleClickOutside = (event) => {
                if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
        
    }, [isOpen, setIsOpen, close]);


    const handleAvatarClick = () => {

    };


    if (!isOpen) return null;

    return (
        <Portal>
            <DialogRoot ref={dialogRef} placement={"center"} open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <HStack p={4}>
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
                        <Spacer/>
                        <RxCross1
                            style={{ 
                                border: 'black', 
                                cursor: 'pointer',
                                fontSize: '24px',
                                color: 'black',
                                alignSelf: 'end',
                                objectFit: 'cover',
                                scale: 2,
                                padding: 4
                            }}
                            onClick={() => setClose(true)}
                        />
                    </HStack>
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
                                            maxW={'80%'}
                                        >
                                            {comment.comment}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                            {replies[String(comment._id)].map((head) => (
                                <Box
                                    key = {head._id}
                                    w = {"80%"} 
                                    bg = {bgColor} 
                                    p = {6} 
                                    rounded = {"lg"} 
                                    shadow = {"md"}
                                    border={"black"}
                                    alignSelf={"end"}
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
                                                maxW={'80%'}
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
                                                maxW={'80%'}
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