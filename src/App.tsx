//import reactLogo from './assets/react.svg';
//import viteLogo from '/vite.svg';


/** TanStack router **/
// Import the generated route tree
import { routeTree } from './routeTree.gen';
import {createRouter, RouterProvider} from "@tanstack/react-router";
// Create a new router instance
const router = createRouter({ routeTree });
// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

/** Mantine **/
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {Theme} from "./components/Root/Theme";
import {EventDataProvider} from "@contexts/EventDataContext";
import { useEffect, useState } from 'react';
//import { initFirebase } from './utils/Firebase.ts';

//import './App.css';

function App() {

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        //initFirebase();
        setInitialized(true);
    }, []);

    return initialized && (
        <MantineProvider theme={Theme}>
            <EventDataProvider>
                <RouterProvider router={router} />
            </EventDataProvider>
        </MantineProvider>
    );

}

export default App;
