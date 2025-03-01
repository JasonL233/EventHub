import React, { useState } from 'react'
import { Box, Button, VStack } from "@chakra-ui/react"
import { CgProfile } from "react-icons/cg";
import { BsPlusSquare } from "react-icons/bs";
import { RiHome6Line } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useDialogStore } from '../../store/dialog';
import { useUserStore } from '../../store/user';
import { Toaster, toaster } from "./toaster"

// Sidebar Component
const Sidebar = () => {
  const openLogin = useDialogStore((state) => state.openLogin);
  const currUser = useUserStore((state) => state.curr_user);
  const {isLoggedIn, userLogOut} = useUserStore();

  const [currPage, setCurrPage] = useState(location.pathname);

  const handleLogout = () => {
    toaster.create({
        title: "Logout Successfully",
        type: "success",
    })
    userLogOut();
    console.log("user logged out");
  }

  return (
    <Box color="black" p={4} w="full">
      <VStack spacing={6} align="stretch" w="full">
        <Link to="/">
          <Button variant="ghost" color="black" justifyContent="flex-start" w="full" bg={currPage === "/" ? "gray.100" : ""} onClick={() => setCurrPage("/")} borderRadius={"3xl"}>
            <RiHome6Line /> Discover
          </Button>
        </Link>

        {currUser?.isEventOrganizer && (<Link to="/create">
          <Button variant="ghost" color="black" justifyContent="flex-start" w="full" bg={currPage === "/create" ? "gray.100" : ""} onClick={() => setCurrPage("/create")} borderRadius={"3xl"}>
            <BsPlusSquare /> Post
          </Button>
        </Link>
        )}

        {currUser && (<Link to="/profile">
          <Button variant="ghost" color="black" justifyContent="flex-start" w="full" bg={currPage === "/profile" ? "gray.100" : ""} onClick={() => setCurrPage("/profile")} borderRadius={"3xl"}>
            <CgProfile /> Profile
          </Button>
        </Link>
        )} 
        <Link to="/">
          <Button variant="ghost" color="black" justifyContent="flex-start" w="full" onClick={() => { if(isLoggedIn) {handleLogout();} else {openLogin()} setCurrPage("/")}} borderRadius={"3xl"}>
            <CiLogin/>{isLoggedIn ? "Logout" : "Login"}
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}

export default Sidebar
