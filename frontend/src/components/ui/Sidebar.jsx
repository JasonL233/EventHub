import React from 'react'
import { Box, Button, VStack } from "@chakra-ui/react"
import { CgProfile } from "react-icons/cg";
import { BsPlusSquare } from "react-icons/bs";
import { RiHome6Line } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useDialogStore } from '../../store/dialog';
import { useUserStore } from '../../store/user';

// Sidebar Component
const Sidebar = () => {
  const openLogin = useDialogStore((state) => state.openLogin);
  const currUser = useUserStore((state) => state.curr_user);

  return (
    <Box bg="gray.800" color="white" p={4}>
      <VStack spacing={6} align="stretch">
        <Link to="/">
          <Button variant="ghost" color="white" justifyContent="flex-start">
            <RiHome6Line /> Discover
          </Button>
        </Link>
        {currUser?.isEventOrganizer && (<Link to="/create">
          <Button variant="ghost" color="white" justifyContent="flex-start">
            <BsPlusSquare /> Post
          </Button>
        </Link>
        )}

        {currUser && (<Link to="/profile">
          <Button variant="ghost" color="white" justifyContent="flex-start">
            <CgProfile /> Profile
          </Button>
        </Link>
        )} 
        <Button variant="ghost" color="white" justifyContent="flex-start" onClick={openLogin}>
          <CiLogin /> Login
        </Button>
      </VStack>
    </Box>
  );
}

export default Sidebar
