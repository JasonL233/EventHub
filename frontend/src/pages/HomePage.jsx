import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import React, { useEffect } from 'react';
// Components
import EventCard  from '../components/ui/EventCard';
// Stores
import { useEventStore } from '../store/event';
import { useUserStore } from '../store/user';


const HomePage = () => {
  const {fetchEvents, events} = useEventStore();
  const currUser = useUserStore((state) => state.curr_user);

  useEffect ( () => {
    fetchEvents();
  }, [fetchEvents]);
  console.log("Events: ", events);

  return (

        <ResponsiveMasonry
          columnsCountBreakPoints={{ 400: 1, 500: 2, 1000: 3, 1400: 4, 1800: 5 }}

        >
          <Masonry > 
            {events.map((event) => (
                <EventCard key={event._id} event={event} user={currUser} />
            ))}
          </Masonry>
        </ResponsiveMasonry>

  )
}

export default HomePage
