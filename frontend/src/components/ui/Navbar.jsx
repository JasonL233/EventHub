import React from 'react'
import {NativeSelect, Button, Input, HStack, Field, Flex,} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { useState , useEffect} from 'react';
import { Link } from "react-router-dom";
import { useEventStore } from '../../store/event'


const Navbar = () => {

  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('Event Title');
  const {fetchEventsByTitle, fetchEvents} = useEventStore();

  const handleSearch = async (query) => {
    const searchQuery = query || searchText;

    // empty search matches all events
    if (!searchQuery) {
      fetchEvents();
      return;
    }

    switch (searchType) {
      case "Event Title" : 
        fetchEventsByTitle(searchQuery);
        console.log("searchQuery: ", searchQuery)
        break;
      case "Event Tag" :
        /* todo */
          break;
      case "Username" :
        /* todo */
          break;
      default :
        break;
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e.target.value);
    }
  }

  return (
    <Flex align="center" justify="center">
      <HStack h="150px" w="1000px" align="center" justify="center" mt="-20px">
        <NativeSelect.Root w="150px" variant="filled">
            <NativeSelect.Field color="black" onChange={(e) => setSearchType(e.target.value)}>
              <option value="Event Title">Event Title</option>
              <option value="Event Tag">Event Tag</option>
              <option value="Username">Username</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Input 
            w="700px" 
            h="50px" 
            variant="filled" 
            bg="gray.100" 
            borderRadius="full" 
            color="black" 
            placeholder="Search" 
            onChange={(e)=> setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Link to="/">
            <Button aria-label="Search database" onClick={() => {handleSearch()}}>
              <CiSearch />
            </Button>
          </Link>
      </HStack>
    </Flex>
  )
}

export default Navbar
