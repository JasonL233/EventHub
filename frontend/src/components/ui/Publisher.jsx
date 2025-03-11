import React, { useEffect, useState } from 'react';
import { Text, Image, HStack, Button} from "@chakra-ui/react";
import { useUserStore } from '../../store/user.js';
import { useDialogStore } from '../../store/dialog';
import { useNavigate } from "react-router-dom";

const Publisher = ({ event }) => {
    // Add React Router navigate function
    const navigate = useNavigate();
    // Get current user
    const curUser = useUserStore((state) => state.curr_user);
    // Publisher
    const {fetchUser, user} = useUserStore();
    const [publisher, setPublisher] = useState();
    // login prompt
    const openLogin = useDialogStore((state) => state.openLogin);
    // Folow
    const {updateFollowing} = useUserStore();
    // Loading state
    const [loading, setLoading] = useState(true);

    const [follow, setFollow] = useState('following');


    useEffect(() => {
        fetchUser(event.publisherId);      
    }, [fetchUser, event]);

    useEffect(() => {
        setPublisher(user);
        setLoading(false);
    }, [user])

    const handleFollow = () => {
        if (curUser) {
            updateFollowing(curUser._id, publisher._id, true);
        } else {
            openLogin();
        }
    }

    const handleUnfollow = () => {
        if (curUser) {
            updateFollowing(curUser._id, publisher._id, false);
        } else {
            openLogin();
        }
    }

    if (loading) return(
        <HStack w={'full'}></HStack>
    );

    return (
        <HStack w={'full'}>
            <Image 
                src={publisher ? publisher.profileImage : '/user_portrait.png'} 
                shadow={"md"} 
                border="black"
                borderRadius={"full"} 
                boxSize={"100px"}
                objectFit={"cover"}
                alignSelf={'self-start'}
                cursor={'pointer'}
                onClick={() => navigate(`/profile/${event.publisherId}`)}
            />
            <Text
                fontSize={"xl"}
                fontWeight={"bold"}
                bgClip={"text"}
                textAlign={"left"}
                color={"black"}
                whiteSpace={"pre-line"}
                maxW={'80%'}
                >
                {publisher ? publisher.username : 'Unknown User'}
            </Text>
            {publisher && curUser && (curUser.following.includes(publisher._id)? (
                <Button
                    border={'transparent'}
                    background={'transparent'}
                    cursor={'pointer'}
                    fontSize={'26px'}
                    color={'black'}
                    scale={0.8}
                    onMouseEnter={() => setFollow('• Unfollow')}
                    onMouseLeave={() => setFollow('• Following')}
                    _hover={{
                        fontSize: 30,
                        color: 'gray.500',
                        backgroundColor: 'gray.300',
                        transition: "0.1s ease-in-out"
                        }}
                    rounded={"lg"}
                    onClick={handleUnfollow}
                >
                    {follow}
                </Button>
            ) : (
                <Button
                    border={'transparent'}
                    background={'transparent'}
                    cursor={'pointer'}
                    fontSize={'26px'}
                    color={'black'}
                    scale={0.8}
                    _hover={{
                        fontSize: 30,
                        color: 'gray.500'
                        }}
                    rounded={"lg"}
                    onClick={handleFollow}
                >
                    • Follow
                </Button>
            ))}
            {!curUser && (
                <Button
                    border={'transparent'}
                    background={'transparent'}
                    cursor={'pointer'}
                    fontSize={'26px'}
                    color={'black'}
                    scale={0.8}
                    _hover={{
                        fontSize: 30,
                        color: 'gray.500'
                        }}
                    rounded={"lg"}
                    onClick={() => openLogin()}
                >
                    • Follow
                </Button>
            )}
        </HStack>
    );
}

export default Publisher