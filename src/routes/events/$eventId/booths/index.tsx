import LazyRenderer from '@components/LazyRenderer';
import { useEventData } from '@contexts/EventDataContext';
import { Booth } from '@/types/Booth';
import { Event } from '@/types/Event';
import { Grid, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { lazy, memo, useCallback, useEffect, useState } from 'react';
import { S3DataClient } from '@/utils/S3DataClient';

const BoothCard = lazy(() => import('@components/BoothCard').then((module) => ({ default: module.BoothCard })));

const BoothCardButton = memo(({ booth, event, layout }: { booth: Booth, event: Event, layout: string }) => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        navigate({
            to: '/events/' + event.id + '/booths/' + booth.id,
        });
    }, [event, booth, navigate]);

    return (
        <UnstyledButton
            h={"100%"} w={"100%"}
            style={{
                flexShrink: 0,
                boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                borderRadius: 8,
            }}
            onClick={handleClick}
        >
            <BoothCard
                event={event}
                booth={booth}
                layout={"grid"}
            />
        </UnstyledButton>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.booth.id === nextProps.booth.id &&
        prevProps.event.id === nextProps.event.id &&
        prevProps.layout === nextProps.layout
    );
});

export const Route = createFileRoute('/events/$eventId/booths/')({
  component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    const { eventId } = Route.useParams();
    const { events, getEvent, getBooths } = useEventData();

    const [event, setEvent] = useState<Event|undefined>();
    useEffect(() => {
        getEvent(eventId).then((event) => {
            if (event) {
                setEvent(event);
            }
        });
    }, [getEvent, eventId]);

    const [booths, setBooths] = useState<Booth[]>([]);
    useEffect(() => {
        if (!event) return;
        getBooths(event.id).then((booths) => {
            setBooths(booths);
        });
    }, [event, getBooths]);

    if (!event) {
        return (
            <Title
                order={3}
            >
                Event not found!
            </Title>
        )
    }

    return (
        <Stack
            h={"100%"} w={"100%"}
        >
            <Grid
                p={8}
                columns={12}
            >
                {booths && booths.map((booth) => {
                    return (
                        <Grid.Col
                            key={booth.id}
                            span={{
                                xs: 12,
                                sm: 12,
                                md: 6,
                                lg: 6,
                                xl: 4,
                            }}
                        >
                            <LazyRenderer
                                threshold={0.1}
                                fallback={
                                    <Stack
                                        h={240} w={"100%"}
                                        gap={0}
                                        bg={"gray.4"}
                                        style={{
                                            borderRadius: 8,
                                            overflow: "hidden",
                                        }}
                                    >
                                    </Stack>
                                }
                            >
                                <BoothCardButton
                                    booth={booth}
                                    event={event}
                                    layout={"grid"}
                                />
                            </LazyRenderer>
                        </Grid.Col>
                    )
                })}
            </Grid>
        </Stack>
    );
}