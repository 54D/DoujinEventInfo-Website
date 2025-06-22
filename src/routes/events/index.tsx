import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Box, Grid, Group, Stack, Text, Title, UnstyledButton} from "@mantine/core";
import {EventCard} from "@components/EventCard.tsx";
import { useEventData } from '@/contexts/EventDataContext';
import { useEffect, useState } from 'react';
import { Event } from '@/types/Event';

export const Route = createFileRoute('/events/')({
    component: RouteComponent
})

function RouteComponent() {
    const navigate = useNavigate();

    const { events } = useEventData();

    return (
        <Stack
            h={"100%"} w={"100%"}
        >
            <Title
                order={3}
            >
                所有場次
            </Title>
            <Grid
                p={8}
                columns={12}
            >
                {events.map((event) => {
                    return (
                        <Grid.Col
                            key={event.id}
                            span={{
                                base: 12,
                                xs: 12,
                                sm: 12,
                                md: 6,
                                lg: 6,
                                xl: 6,
                            }}
                        >
                            <UnstyledButton
                                key={event.id}
                                h={{
                                    base: 320,
                                    xs: 320,
                                    sm: 320,
                                    md: 400,
                                    lg: 400,
                                    xl: 400,
                                }}
                                w={"100%"}
                                style={{
                                    flexShrink: 0,
                                    boxShadow: "2px 2px 8px rgba(0,0,0,0.4)",
                                    borderRadius: 16,
                                }}
                                onClick={() => navigate({
                                    to: '/events/' + event.id,
                                })}
                            >
                                <EventCard key={event.id} event={event}/>
                            </UnstyledButton>
                        </Grid.Col>
                    )
                })}
            </Grid>
        </Stack>
    )

    /*
    return (
        <Stack
            h={"100%"} w={"100%"}
        >
            <Title
                order={3}
            >
                What's New
            </Title>
            <Group 
                h={"480"} w={"100%"}
                p={8}
                style={{
                    overflowX: "auto", overflowY: "hidden",
                    flexWrap: "nowrap",
                }}
            >
                {events.map((event) => {
                    return (
                        <UnstyledButton
                            key={event.id}
                            style={{
                                height: "100%", width: 600,
                                flexShrink: 0,
                                boxShadow: "2px 2px 8px rgba(0,0,0,0.4)",
                                borderRadius: 16,
                            }}
                            onClick={() => navigate({
                                to: '/events/' + event.id,
                            })}
                        >
                            <EventCard key={event.id} event={event}/>
                        </UnstyledButton>
                    )
                })}
            </Group>
        </Stack>
    )
        */
}
