import {create} from "zustand"

export const useEventStore = create((set) => ({
    events:[],
    setEvents: (events) => set({ events }),


    fetchEvent: async (id) => {
        const respond = await fetch("/api/events/{id}");
        const data = await respond.json();
    }
}));