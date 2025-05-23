import {Event} from "@/types/Event";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Text} from "@mantine/core";
import dayjs from "dayjs";
import { S3DataClient } from "@utils/S3DataClient";
import { Booth } from "@/types/Booth";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";

type EventDataContextType = {
    events: Event[];
    getEvents: () => Promise<Event[]>;
    getEvent: (eventId: string) => Promise<Event | undefined>;
    booths: {
        [eventId: string]: Booth[];
    };
    getBooths: (eventId: string) => Promise<Booth[]>;
    getBooth: (eventId: string, boothId: number) => Promise<Booth | undefined>;
}

const EventDataContext = createContext<EventDataContextType>({
    events: [],
    getEvents: () => Promise.resolve([]),
    getEvent: () => Promise.resolve(undefined),
    booths: {},
    getBooths: () => Promise.resolve([]),
    getBooth: () => Promise.resolve(undefined),
});

export function EventDataProvider({ children }: any) {
    const { eventId } = useParams({ strict: false });

    const [events, setEvents] = useState<Event[]>([]);

    const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
    useEffect(() => {
        if (eventId) {
            const event = events.find((event) => event.id == eventId);
            if (event) {
                setCurrentEvent(event);
            }
        }
    }, [eventId, events]);

    const [booths, setBooths] = useState<{
        [eventId: string]: Booth[];
    }>({});
    useEffect(() => {
        if (!currentEvent) return;
        S3DataClient.getBooths(currentEvent.id)
        .then((booths: Booth[]) => {
            setBooths((prevBooths) => ({
                ...prevBooths,
                [currentEvent.id]: booths,
            }));
        })
        .catch((err) => {
            console.error("Error fetching booths: ", err);
        });
    }, [currentEvent]);

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = useCallback(async () => {
        return S3DataClient.getEvents().then((events: Event[]) => {
            const sortedEvents = events.sort((a: Event, b: Event) => {
                const aStart = dayjs(a.startTime);
                const bStart = dayjs(b.startTime);
                if (aStart.isBefore(bStart)) {
                    return 1;
                }
                if (aStart.isAfter(bStart)) {
                    return -1;
                }
                return 0;
            });
            setEvents(sortedEvents);
            return sortedEvents;
        });
    }, [events]);

    const getEvent = useCallback(async (eventId: string) => {
        return events.find((event) => event.id == eventId);
    }, [events]);

    const getBooths = useCallback(async (eventId: string) => {
        if (booths[eventId]) {
            return booths[eventId];
        } else {
            return S3DataClient.getBooths(eventId).then((booths: Booth[]) => {
                setBooths((prevBooths) => ({
                    ...prevBooths,
                    [eventId]: booths,
                }));
                return booths;
            });
        }
    }, [booths]);

    const getBooth = useCallback(async (eventId: string, boothId: number) => {
        if (Object.keys(booths).includes(eventId)) {
            return booths[eventId].find((booth) => booth.id == boothId);
        }
        return getBooths(eventId).then((booths: Booth[]) => {
            return booths.find((booth) => booth.id == boothId);
        });
    }, [booths]);

    return (
        <EventDataContext.Provider value={{
            events, getEvents, getEvent,
            booths, getBooths, getBooth,
        }}>
            {!events && <Text>Loading...</Text>}
            {events && children}
        </EventDataContext.Provider>
    );

}


export function useEventData() {
    return useContext(EventDataContext);
}