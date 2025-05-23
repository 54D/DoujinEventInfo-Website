import {createFileRoute, Outlet, redirect, useLoaderData, useLocation, useNavigate} from '@tanstack/react-router'
import {Box, Button, getGradient, Grid, Group, Image, Stack, Tabs, Text, Title, UnstyledButton, useMantineTheme} from "@mantine/core";
import React, {memo, useCallback, useEffect, useState} from "react";
import { BoothCard } from '@components/BoothCard';
import {useEventData} from "@contexts/EventDataContext";
import {Booth} from "@/types/Booth.ts";
import {Event} from "@/types/Event.ts";
import { MdGroups, MdInfo, MdInfoOutline, MdKeyboardArrowLeft, MdOutlineCircle } from 'react-icons/md';
import { PageTitle } from '@components/Root/PageTitle';

export const Route = createFileRoute('/events/$eventId')({
    component: RouteComponent,
})

function RouteComponent() {
    const theme = useMantineTheme();
    const { eventId } = Route.useParams();
    const location = useLocation();
    const activeTab = location.pathname.split('/').slice(-1)[0];
    const { getEvent } = useEventData();
    const navigate = useNavigate();

    useEffect(() => {
        navigate({
            to: '/events/' + eventId + '/booths',
            replace: true,
        });
    }, []);

    const event = getEvent(eventId);
    if (!event) {
        return (
            <Title
                order={3}
            >
                Event not found!
            </Title>
        );
    }

    return (
        <Stack
            h={"100%"} w={"100%"}
        >
            <PageTitle
                title={
                    <Group
                        h={240} w={"100%"}
                        p={16} 
                        gap={16}
                        style={{
                            background: getGradient({
                                from: "blue.4",
                                to: "blue.6",
                                deg: 135,
                            }, theme),
                            borderRadius: 16,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            bg={"grey"}
                            flex={1} h={"100%"}
                            style={{
                                borderRadius: 8,
                                overflow: "hidden",
                            }}
                        >
                            <Image
                                src={"/data/events/" + event.id + "/eventCover.jpg"}
                                alt={event.nameEnUS}
                                fit='cover'
                            />
                        </Box>
                        <Stack
                            flex={4} h={"100%"}
                            pt={8} pb={8}
                            gap={8}
                            align={"flex-start"} justify={"flex-start"}
                        >
                            <Title
                                order={1}
                                c={"white"}
                            >
                                {event.nameEnUS}
                            </Title>
                            <Text c="white">{event.descriptionEnUS}</Text>
                        </Stack>
                    </Group>
                }
                showBackButton={true}
                onBackButtonClick={() => navigate({
                    to: '/events',
                })}
            />
            <Tabs
                value={activeTab}
                onChange={(value) => {
                    navigate({
                        to: '/events/' + eventId + '/' + value,
                    });
                }}
            >
                <Tabs.List>
                    <Tabs.Tab value={"booths"}>
                        <Group
                            w={120}
                            gap={8}
                            align={"center"} justify={"center"}
                        >
                            <MdGroups/>
                            <Text>Booths</Text>
                        </Group>
                    </Tabs.Tab>
                    <Tabs.Tab value={"details"}>
                        <Group
                            w={120}
                            gap={8}
                            align={"center"} justify={"center"}
                        >
                            <MdInfo/>
                            <Text>Details</Text>
                        </Group>
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
            <Outlet/>
        </Stack>
    )
}
