import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import React, { useEffect } from 'react';
import { Text } from "@chakra-ui/react"
// Components
import EventCard  from '../components/ui/EventCard';
// Stores
import { useEventStore } from '../store/event';
import { useUserStore } from '../store/user';


const HomePage = () => {
  const {fetchEvents, events} = useEventStore();
  const currSearchType = useEventStore((state) => state.searchType);
  const currSearchText = useEventStore((state) => state.searchText);
  const currUser = useUserStore((state) => state.curr_user);

  useEffect ( () => {
    fetchEvents();
  }, [fetchEvents]);
  console.log("Events: ", events);
  console.log("SEARCHTYPE: ", currSearchType);

  return (
    <div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 400: 1, 500: 2, 1000: 3, 1400: 4, 1800: 5 }}>
        <Masonry > 
          {events.map((event) => (
              <EventCard key={event._id} event={event} user={currUser} />
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {events.length === 0 && (
        <Text fontSize="xl" fontWeight="bold" color="yellow.400" textAlign="center" mt={10} p={5}>
          {currSearchType === "Event Title" 
            ? `No events match title '${currSearchText}'`
            : currSearchType === "Event Tag"
            ? `No events match tag '${currSearchText}'`
            : currSearchType === "Username"
            ? `No events match username '${currSearchText}'`
            : "No events found. Try a different search term or category"
          }
        </Text>
      )}
    </div>
  )
}

export default HomePage
