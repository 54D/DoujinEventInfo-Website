import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button, Stack, Text} from "@mantine/core";
import { useEffect } from 'react';
import {PageRoot} from "@components/Page/PageRoot.tsx";

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate({
            to: '/events',
        })
    }, []);

    return (
        <PageRoot>
            <Text>What's New!</Text>
            <Button
                variant={"gradient"}
                onClick={() => navigate({
                    to: '/events',
                })}
            >
                Check out the events!
            </Button>
        </PageRoot>
    )
}
