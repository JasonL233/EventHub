import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEventStore = create(
  persist((set) => ({
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

      // Get events that match title
      fetchEventsByTitle: async (title) => {
        const respond = await fetch(`/api/search/events/${title}`);
        const data = await respond.json();
        set({events: data.data})
      },

    updateLikes: async (event_id, user_id, isLiked, newLikes) => {
      const res = await fetch(`/api/events/${event_id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, action: isLiked ? "like" : "unlike", likes: newLikes }),
      });

      if (!res.ok) {
        console.error("Failed to update like status");
        return;
      }

      const data = await res.json();

      set((state) => ({
        events: state.events.map((evn) =>
          evn._id === event_id ? { ...evn, likes: newLikes, likedBy: data.data.likedBy } : evn
        ),
      }));
    },

    
  }))
  
);
