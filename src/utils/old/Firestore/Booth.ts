import { collection, query, orderBy, limit, getDocs, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { Event } from "@/types/Event";

type Options = {
    eventId: string;
}

export async function getBooths(options: Options) {

    if (!db) return;
    
    const eventsRef = collection(doc(collection(db, "events"), options.eventId), "booths");
    const q = query(eventsRef, orderBy("startTime", "desc"), limit(100));

    const events: Event[] = [];

    await getDocs(q).then((querySnapshot) => {
        console.log("[EventData] Fetched", querySnapshot.size, "events");
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const event: Event = {
                id: doc.id,
                nameEnUS: data.nameEnUS,
                organizerEnUS: data.organizerEnUS,
                startTime: data.startTime.toDate(),
                endTime: data.endTime.toDate(),
                locationEnUS: data.locationEnUS,
                descriptionEnUS: data.descriptionEnUS,
                ageRating: data.ageRating,
                links: data.links,
                tags: data.tags,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            };
            events.push(event);
        });
    });
    
    return events;
    
}