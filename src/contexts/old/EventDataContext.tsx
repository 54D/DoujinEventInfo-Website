/*

import {Event} from "@/types/Event";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Text} from "@mantine/core";
import { db } from "@utils/Firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { getEvents } from "@utils/Firestore/Event";

type EventDataContextType = {
    events: Event[];
    getEvent: (eventId: string) => Event | undefined;
}

const EventDataContext = createContext<EventDataContextType>({
    events: [],
    getEvent: () => undefined,
});

export function EventDataProvider({ children }: any) {

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        if (!db) return;
        getEvents().then((events) => {
            if (!events) return;
            console.log("[EventData] Fetched", events.length, "events");
            console.log(events);
            setEvents(events);
        });
    }, [db]);

    const getEvent = useCallback((eventId: string) => {
        return events.find((event) => event.id == eventId);
    }, [events]);

    return (
        <EventDataContext.Provider value={{ events, getEvent }}>
            {!events && <Text>Loading...</Text>}
            {events && children}
        </EventDataContext.Provider>
    );

}


export function useEventData() {
    return useContext(EventDataContext);
}

*/