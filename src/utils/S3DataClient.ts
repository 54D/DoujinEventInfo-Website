import axios from "axios";
import { Booth } from "@/types/Booth";
import { Event } from "@/types/Event";

export namespace S3DataClient {

    const client = axios.create({
        baseURL: import.meta.env.VITE_AWS_S3_DATA_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    export async function getEvents(): Promise<Event[]> {
        const response = await client.get("/events/index.json");
        return response.data as Event[];
    }

    export async function getBooths(eventId: string): Promise<Booth[]> {
        const response = await client.get(`/events/${eventId}/booths.json`);
        return response.data as Booth[];
    }

    export function getEventAssetUrl(eventId: string, path: string): string {
        return `${import.meta.env.VITE_AWS_S3_DATA_URL}/events/${eventId}/assets/${path}`;
    }

}