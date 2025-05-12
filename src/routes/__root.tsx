import {Outlet, createRootRoute, Link} from '@tanstack/react-router'
import {TanStackRouterDevtools} from "@tanstack/router-devtools"
import {Box, Button, Flex, Group, Stack} from "@mantine/core";
import { Shell } from '@/components/Root/Shell';

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <Shell>
            <Outlet/>
            <TanStackRouterDevtools/>
        </Shell>
    )
}
