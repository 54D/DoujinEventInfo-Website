import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { Event } from "@/types/Event";

export async function getEvents() {

    if (!db) return;
    
    const eventsRef = collection(db, "events");
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
                numberOfDays: data.numberOfDays,
                locationEnUS: data.locationEnUS,
                descriptionEnUS: data.descriptionEnUS,
                coverImageName: data.coverImageName,
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