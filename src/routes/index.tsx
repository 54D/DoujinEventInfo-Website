import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button, Stack, Text} from "@mantine/core";
import { useEffect } from 'react';

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
        <Stack>
            <Text>What's New!</Text>
            <Button
                variant={"gradient"}
                onClick={() => navigate({
                    to: '/events',
                })}
            >
                Check out the events!
            </Button>
        </Stack>
    )
}
