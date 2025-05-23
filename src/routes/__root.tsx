import {Outlet, createRootRoute, Link, useNavigate} from '@tanstack/react-router'
import {TanStackRouterDevtools} from "@tanstack/router-devtools"
import {Box, Button, Flex, Group, Stack} from "@mantine/core";
import { Shell } from '@components/Root/Shell';
import { EventDataProvider } from '@/contexts/EventDataContext';
import { useEffect } from 'react';

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <EventDataProvider>
            <Shell>
                <Outlet/>
                <TanStackRouterDevtools/>
            </Shell>
        </EventDataProvider>
    )
}
