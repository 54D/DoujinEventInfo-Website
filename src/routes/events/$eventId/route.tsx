import {createFileRoute, Outlet, redirect, useLoaderData, useLocation, useNavigate} from '@tanstack/react-router'
import {Box, Button, getGradient, Grid, Group, Image, Space, Stack, Tabs, Text, Title, UnstyledButton, useMantineTheme} from "@mantine/core";
import React, {memo, useCallback, useEffect, useState} from "react";
import { BoothCard } from '@components/BoothCard';
import {useEventData} from "@contexts/EventDataContext";
import {Booth} from "@/types/Booth.ts";
import {Event} from "@/types/Event.ts";
import { MdCalendarMonth, MdCalendarToday, MdGroup, MdGroups, MdInfo, MdInfoOutline, MdKeyboardArrowLeft, MdLocationCity, MdLocationPin, MdOutlineCircle } from 'react-icons/md';
import { PageTitle } from '@components/Root/PageTitle';
import dayjs from 'dayjs';
import { S3DataClient } from '@/utils/S3DataClient';

export const Route = createFileRoute('/events/$eventId')({
    component: RouteComponent,
})

function RouteComponent() {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const { eventId } = Route.useParams();
    const location = useLocation();
    const activeTab = location.pathname.split('/')[3]; // assume {baseUrl}/events/{event.id}/booths
    const isViewingEvent = location.pathname.split('/')[4] == undefined;
    const { events, getEvent } = useEventData();

    useEffect(() => {
        navigate({
            to: '/events/' + eventId + '/booths',
            replace: true,
        })
    }, [eventId]);
    
    const [event, setEvent] = useState<Event|undefined>();
    useEffect(() => {
        getEvent(eventId).then((event) => {
            if (event) {
                setEvent(event);
            }
        });
    }, [getEvent, eventId]);

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
            { isViewingEvent && <>
                <PageTitle
                    showBackButton={true}
                    onBackButtonClick={() => navigate({
                        to: '/events',
                    })}
                />
                <Group
                    pos={"relative"}
                    h={200} w={"100%"}
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
                        boxShadow: theme.shadows.md,
                    }}
                >
                    <Box
                        bg={"grey"}
                        style={{
                            height: "100%", width: "20%",
                            overflow: "hidden",
                            borderRadius: 8,
                        }}
                    >
                        {event.coverImageName && <Image
                            src={S3DataClient.getEventAssetUrl(event.id, event.coverImageName)}
                            alt={event.nameEnUS}
                            h={"100%"} w={"100%"}
                            fit={"cover"}
                            style={{
                                borderRadius: 8,
                                overflow: "hidden",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        />}
                    </Box>
                    <Stack
                        flex={1} h={"100%"}
                        gap={8}
                        align={"flex-start"} justify={"flex-start"}
                    >
                        <Title
                            order={1}
                            c={"white"}
                        >
                            {event.nameEnUS}
                        </Title>
                        <Group
                            gap={8}
                            align={"center"} justify={"center"}
                        >   
                            <Group
                                gap={8}
                                align={"center"} justify={"center"}
                            >
                                <MdCalendarToday size={20} color={"white"}/>
                                <Group
                                    gap={0}
                                    align={"baseline"} justify={"center"}
                                >
                                    <Text fw={600} size={"xs"} c={"white"}>
                                        {dayjs(event.startTime).format("MMM").toLocaleUpperCase()}
                                    </Text>
                                    <Space w={4}/>
                                    <Text fw={600} c={"white"}>
                                        {dayjs(event.startTime).format("D").toLocaleUpperCase()}
                                    </Text>
                                    <Text fw={600} size={"xs"} c={"white"}>
                                        , {dayjs(event.startTime).format("YYYY").toLocaleUpperCase()}
                                    </Text>
                                    {!dayjs(event.startTime).startOf("day").isSame(dayjs(event.endTime).startOf("day")) && (<>
                                        <Space w={4}/>
                                        <Text c={"white"}>-</Text>
                                        <Space w={4}/>
                                        <Text fw={600} size={"xs"} c={"white"}>
                                            {dayjs(event.endTime).format("MMM").toLocaleUpperCase()}
                                        </Text>
                                        <Space w={4}/>
                                        <Text fw={600} c={"white"}>
                                            {dayjs(event.endTime).format("D").toLocaleUpperCase()}
                                        </Text>
                                        <Text fw={600} size={"xs"} c={"white"}>
                                            , {dayjs(event.endTime).format("YYYY").toLocaleUpperCase()}
                                        </Text>
                                    </>)}
                                </Group>
                            </Group>
                            <Text fw={600} c={"white"}>
                                ·
                            </Text>
                            <Group
                                gap={8}
                                align={"center"} justify={"center"}
                            >
                                <MdLocationPin size={20} color={"white"}/>
                                <Group
                                    gap={0}
                                    align={"baseline"} justify={"center"}
                                >
                                    <Text c={"white"}>
                                        {event.locationEnUS}
                                    </Text>
                                </Group>
                            </Group>
                        </Group>
                        {/*}
                        <Group
                            gap={8}
                            align={"center"} justify={"center"}
                        >
                            <MdGroup size={20} color={"white"}/>
                            <Group
                                gap={0}
                                align={"baseline"} justify={"center"}
                            >
                                <Text c={"white"}>
                                    {event.organizerEnUS}
                                </Text>
                            </Group>
                        </Group>
                        */}
                        {/*<Text flex={1} c="white">{event.descriptionEnUS}</Text>*/}
                    </Stack>
                </Group>
                <Tabs
                    value={activeTab}
                    onChange={(value) => {
                        navigate({
                            to: '/events/' + event.id + '/' + value,
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
                                <MdGroups size={20}/>
                                <Text>Booths</Text>
                            </Group>
                        </Tabs.Tab>
                        <Tabs.Tab value={"details"}>
                            <Group
                                w={120}
                                gap={8}
                                align={"center"} justify={"center"}
                            >
                                <MdInfo size={20}/>
                                <Text>Details</Text>
                            </Group>
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </> }
            <Outlet/>
        </Stack>
    )
}
