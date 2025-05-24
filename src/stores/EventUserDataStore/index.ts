import { create, UseBoundStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'

type EventUserDataStore = {
    init: () => void;
    favouriteBooths: number[];
    isFavouriteBooth: (boothId: number) => boolean;
    addFavouriteBooth: (boothId: number) => void;
    removeFavouriteBooth: (boothId: number) => void;
    bookmarkedBooths: number[];
    isBookmarkedBooth: (boothId: number) => boolean;
    addBookmarkedBooth: (boothId: number) => void;
    removeBookmarkedBooth: (boothId: number) => void;
    lastUpdated: Date | null;
}

function _useEventUserDataStore(eventId: string) {
    return create<EventUserDataStore>()(persist(
        immer((set, get) => ({
            init: () => {
                const lastUpdated = get().lastUpdated;
                if (lastUpdated === null) {
                    set((state) => {
                        state.lastUpdated = new Date();
                    });
                }
            },
            favouriteBooths: [],
            isFavouriteBooth: (boothId: number) => {
                return get().favouriteBooths.includes(boothId);
            },
            addFavouriteBooth: (boothId: number) => {
                set((state) => {
                    if (!state.favouriteBooths.includes(boothId)) {
                        state.favouriteBooths.push(boothId);
                    }
                    state.lastUpdated = new Date();
                });
            },
            removeFavouriteBooth: (boothId: number) => {
                set((state) => {
                    if (state.favouriteBooths.includes(boothId)) {
                        state.favouriteBooths = state.favouriteBooths.filter(id => id !== boothId);
                    }
                        state.lastUpdated = new Date();
                });
            },
            bookmarkedBooths: [],
            isBookmarkedBooth: (boothId: number) => {
                return get().bookmarkedBooths.includes(boothId);
            },
            addBookmarkedBooth: (boothId: number) => {
                set((state) => {
                    if (!state.bookmarkedBooths.includes(boothId)) {
                        state.bookmarkedBooths.push(boothId);
                    }
                    state.lastUpdated = new Date();
                });
            },
            removeBookmarkedBooth: (boothId: number) => {
                set((state) => {
                    if (state.bookmarkedBooths.includes(boothId)) {
                        state.bookmarkedBooths = state.bookmarkedBooths.filter(id => id !== boothId);
                    }
                    state.lastUpdated = new Date();
                });
            },
            lastUpdated: null as Date | null,
        })),
        {
            name: "eventUserData-" + eventId,
            version: 1,
            partialize: (state) => ({
                favouriteBooths: state.favouriteBooths,
                bookmarkedBooths: state.bookmarkedBooths,
                lastUpdated: state.lastUpdated,
            }),
            storage: createJSONStorage(() => localStorage),
        }
    ))
}

function useEventUserDataStore(eventId: string) {
    return _useEventUserDataStore(eventId)();
}

export default useEventUserDataStore;