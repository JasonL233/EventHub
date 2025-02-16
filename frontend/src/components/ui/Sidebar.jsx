import React from 'react'
import { Box, Button, VStack } from "@chakra-ui/react"
import { CgProfile } from "react-icons/cg";
import { BsPlusSquare } from "react-icons/bs";
import { RiHome6Line } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router-dom";

// Sidebar Component
const Sidebar = () => (
  <Box bg="gray.800" color="white" p={4}>
    <VStack spacing={6} align="stretch">
      <Link to="/">
        <Button variant="ghost" color="white" justifyContent="flex-start">
          <RiHome6Line /> Discover
        </Button>
      </Link>
      <Link to="/create">
        <Button variant="ghost" color="white" justifyContent="flex-start">
          <BsPlusSquare /> Post
        </Button>
      </Link>
      <Link to="/profile">
        <Button variant="ghost" color="white" justifyContent="flex-start">
          <CgProfile /> Profile
        </Button>
      </Link>
      <Link to="/login">
        <Button variant="ghost" color="white" justifyContent="flex-start">
          <CiLogin /> Login
        </Button>
      </Link>
    </VStack>
  </Box>
);

export default Sidebar
