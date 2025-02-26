import { create } from "zustand";

export const useEventStore = create((set) => ({
  events: [],
  searchType: "Event Title",
  searchText: "",

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
    set({ events: data.data });
  },

  // Get events that match title
  fetchEventsByTitle: async (title, type) => {
    const respond = await fetch(`/api/search/events/${title}`);
    const data = await respond.json();
    const searchedEvents = data.data
    if (searchedEvents.length === 0){
      console.log("NO EVENTS")
    }
    set({ events: data.data });
    set({ searchType: type});
    set({ searchText: title});
  },

  createEvent: async (newEvent) => {
    if (
      !newEvent.title?.trim() ||
      !newEvent.image?.trim() ||
      !newEvent.description?.trim() ||
      !newEvent.publisherId
    ) {
      return {
        success: false,
        message: "Please provide title, description, image, and publisherId",
      };
    }

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    const data = await res.json();
    set((state) => ({ events: [...state.events, data.data] }));
    return { success: true, message: "Event created successfully" };
  },

  updateLikes: async (event_id, user_id, isLiked, newLikes) => {
    const res = await fetch(`/api/events/${event_id}/like`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        action: isLiked ? "like" : "unlike",
        likes: newLikes,
      }),
    });

    if (!res.ok) {
      console.error("Failed to update like status");
      return;
    }

    const data = await res.json();

    set((state) => ({
      events: state.events.map((evn) =>
        evn._id === event_id
          ? { ...evn, likes: newLikes, likedBy: data.data.likedBy }
          : evn
      ),
    }));
  },
}));
