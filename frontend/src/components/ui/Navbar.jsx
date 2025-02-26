import React from 'react'
import {NativeSelect, Button, Input, HStack, Field, Flex} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { useState , useEffect} from 'react';
import { Link } from "react-router-dom";
import { useEventStore } from '../../store/event'


const Navbar = () => {

  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('Event Title');
  const {fetchEventsByTitle, fetchEvents} = useEventStore();

  const handleSearch = async () => {

    // empty search matches all events
    if (!searchText) {
      fetchEvents();
      return;
    }

    switch (searchType) {
      case "Event Title" : 
        fetchEventsByTitle(searchText);
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
      return;
  }

  return (
    <Flex align="center" justify="center">
      <HStack h="150px" w="1000px" align="center" justify="center" >
        <NativeSelect.Root w="150px" variant="filled">
            <NativeSelect.Field color="black" onChange={(e) => setSearchType(e.target.value)}>
              <option value="Event Title">Event Title</option>
              <option value="Event Tag">Event Tag</option>
              <option value="Username">Username</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Input w="700px" variant="filled" colorPalette="gray" color="black" placeholder="search" onChange={(e)=> setSearchText(e.target.value)}/>
          <Link to="/">
            <Button aria-label="Search database" onClick={handleSearch}>
              <CiSearch />
            </Button>
          </Link>
      </HStack>
    </Flex>
  )
}

export default Navbar
