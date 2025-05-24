import { PageTitle } from '@/components/Root/PageTitle'
import { useEventData } from '@/contexts/EventDataContext';
import { Event } from '@/types/Event';
import { Booth } from '@/types/Booth';
import { S3DataClient } from '@/utils/S3DataClient';
import { Stack, Group, getGradient, Box, Image, Text, Title, useMantineTheme, getThemeColor } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react';
import { MdInfo, MdNote, MdNotes } from 'react-icons/md';
import { BiSolidNotepad } from 'react-icons/bi';

export const Route = createFileRoute('/events/$eventId/booths/$boothId/')({
  component: RouteComponent,
})

function RouteComponent() {
    const theme = useMantineTheme();
    const darkThemeColor = useMemo(() => getThemeColor("dark", theme), [theme]);
    const indigoThemeColor = useMemo(() => getThemeColor("indigo", theme), [theme]);
    const navigate = useNavigate();
    const { eventId, boothId } = Route.useParams();
    const { getEvent, getBooth } = useEventData();

    const [event, setEvent] = useState<Event|undefined>();
    const [booth, setBooth] = useState<Booth|undefined>();
    useEffect(() => {
        getEvent(eventId).then((event) => {
            if (event) {
                setEvent(event);
            }
        });
        getBooth(eventId, Number(boothId)).then((booth) => {
            if (booth) {
                setBooth(booth);
            }
        });
    }, [getEvent, getBooth, eventId, boothId]);

    if (!event || !booth) {
        return (
            <Title
                order={3}
            >
                Booth not found!
            </Title>
        );
    }

    return (
        <Stack
            h={"100%"} w={"100%"}
        >
            <PageTitle
                showBackButton={true}
                onBackButtonClick={() => navigate({
                    to: '/events/' + eventId + '/booths',
                })}
            />
            <Group
                pos={"relative"}
                h={480} w={"100%"}
                style={{
                    borderRadius: 16,
                    overflow: "hidden",
                }}
            >
                <Image
                    flex={1} w={"100%"} h={"100%"}
                    src={`${import.meta.env.VITE_AWS_S3_DATA_URL}/events/${event.id}/eventCover.jpg`}
                    alt={booth.circle}
                    //fallbackSrc={`${import.meta.env.VITE_AWS_S3_DATA_URL}/events/${event.id}/eventCover.jpg`}
                    fit={"contain"}
                    radius={"md"}
                    style={{
                        backgroundColor: theme.colors.gray[3]
                    }}
                />
                <Group
                    pos={"absolute"} bottom={0} left={0}
                    w={"100%"}
                    p={24}
                    align={"flex-end"} justify={"space-between"}
                    style={{
                        backgroundImage: "linear-gradient(to bottom, rgba(180,180,180,0) 0%, rgba(220,220,220,0.7) 60%",
                    }}
                >
                    <Text
                        flex={3}
                        fw={600} lh={1.2}
                        style={{
                            fontSize: 48,
                            WebkitTextStroke: "1px rgba(80,80,80,0.5)",
                        }}
                    >
                        {booth.circle}
                    </Text>
                    <Group
                        flex={1}
                        align={"center"} justify={"flex-end"}
                    >
                        {booth.attendance.map((attendance) => {
                            return (
                                <Group
                                    key={`${attendance.day}-${attendance.location}`}
                                    gap={0}
                                >
                                    <Group
                                        p={2}
                                        pr={0}
                                        gap={0}
                                        style={{
                                            backgroundColor: indigoThemeColor,
                                            borderTopLeftRadius: 8,
                                            borderBottomLeftRadius: 8,
                                            borderColor: indigoThemeColor,
                                            borderStyle: "solid",
                                        }}
                                    >
                                        <Text
                                            size={"xl"} c={"white"}
                                        >
                                            {attendance.day}
                                        </Text>
                                        <Text
                                            size={"sm"} c={"white"}
                                        >
                                            日目
                                        </Text>
                                    </Group>
                                    <Group
                                        p={2}
                                        gap={0}
                                        style={{
                                            backgroundColor: darkThemeColor,
                                            borderRadius: 8,
                                            borderColor: indigoThemeColor,
                                            borderStyle: "solid",
                                        }}
                                    >
                                        <Text
                                            size={"xl"} fw={600} c={"white"}
                                            style={{
                                                fontSize: 28
                                            }}
                                        >
                                            {attendance.location}
                                        </Text>
                                        {attendance.isBorrowed && <Text
                                            size={"xl"} c={"lightgray"}
                                        >
                                            (借)
                                        </Text>}
                                    </Group>
                                </Group>
                            )
                        })}
                    </Group>
                </Group>
            </Group>
            <Group
                w={"100%"}
                pl={48} pr={48}
            >
                <Stack
                    flex={2}
                >
                    <Group
                        w={"100%"}
                        align={"center"} justify={"flex-start"}
                        pb={8}
                        gap={8}
                        style={{
                            borderColor: theme.colors.gray[3],
                            borderBottomStyle: "solid",
                            borderBottomWidth: 1,
                        }}
                    >
                        <MdInfo size={24}/>
                        <Title
                            order={4}
                        >
                            Basic information
                        </Title>
                    </Group>
                </Stack>
                <Stack
                    flex={1}
                >
                    <Group
                        w={"100%"}
                        align={"center"} justify={"flex-start"}
                        pb={8}
                        gap={8}
                        style={{
                            borderColor: theme.colors.gray[3],
                            borderBottomStyle: "solid",
                            borderBottomWidth: 1,
                        }}
                    >
                        <BiSolidNotepad size={24}/>
                        <Title
                            order={4}
                        >
                            My notes
                        </Title>
                    </Group>
                </Stack>
            </Group>
        </Stack>
    )

}
