import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEventStore = create(
  persist (
    (set) => ({

      events: [],

      // Update events state
      setEvents: (events) => set({ events }),

      // GET single event data
      fetchEvent: async (id) => {
        const respond = await fetch(`/api/events/${id}`);
        const data = await respond.json();
        set({ events: data });
      },

      // GET all events data
      fetchEvents: async () => {
        const res = await fetch("/api/events");
        const data = await res.json();
        set({ events: data.data});
      },

      updateLikes: async (id, newLikes) => {
        const res = await fetch(`/api/events/${id}/like`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({likes: newLikes}),
              
        });

        set(state => ({
            events: state.events.map((evn) => 
                evn._id === id ? {...evn, likes: newLikes} : evn),
        }));
      }
    })
  )
);
