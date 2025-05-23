import { PageTitle } from '@/components/Root/PageTitle'
import { useEventData } from '@/contexts/EventDataContext';
import { Event } from '@/types/Event';
import { Booth } from '@/types/Booth';
import { S3DataClient } from '@/utils/S3DataClient';
import { Stack, Group, getGradient, Box, Image, Text, Title, useMantineTheme } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { MdInfo } from 'react-icons/md';

export const Route = createFileRoute('/events/$eventId/booths/$boothId/')({
  component: RouteComponent,
})

function RouteComponent() {
    const theme = useMantineTheme();
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
                    w={"100%"} h={120}
                    p={16}
                    style={{
                        backgroundImage: "linear-gradient(to bottom, rgba(180,180,180,0) 0%, rgba(220,220,220,0.7) 60%",
                    }}
                >
                    <Text
                        fw={600}
                        style={{
                            fontSize: 48,
                        }}
                    >
                        {booth.circle}
                    </Text>
                </Group>
            </Group>
            <Stack
                w={"100%"}
                pl={48} pr={48}
            >
                <Group
                    w={"100%"}
                    align={"center"} justify={"flex-start"}
                    gap={8}
                    style={{
                        borderColor: theme.colors.gray[3],
                        borderBottomStyle: "solid",
                        borderBottomWidth: 1,
                    }}
                >
                    <MdInfo size={24}/>
                    <Title
                        order={3}
                    >
                        Basic information
                    </Title>
                </Group>
            </Stack>
        </Stack>
    )

}
