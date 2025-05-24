import LazyRenderer from '@components/LazyRenderer';
import { useEventData } from '@contexts/EventDataContext';
import { Booth } from '@/types/Booth';
import { Event } from '@/types/Event';
import { Button, ButtonGroup, Grid, Group, Stack, Text, TextInput, Title, UnstyledButton, useMantineTheme } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { lazy, memo, useCallback, useEffect, useState } from 'react';
import { S3DataClient } from '@/utils/S3DataClient';
import { useDebouncedCallback } from '@mantine/hooks';
import { MdCalendarToday, MdFilterAlt, MdSearch } from 'react-icons/md';
import { debounce, range } from 'lodash';

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
    const theme = useMantineTheme();
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
    
    const [filterByText, setFilterByText] = useState<string>("");
    const [filterByDay, setFilterByDay] = useState<number[]>([]);
    const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
    const updateFilteredBooths = useCallback(debounce(({
        text,
        day,
    }: {
        text: string;
        day: number[];
    }) => {
        if (!event) return;
        let newFilteredBooths = [...booths];
        if (day.length > 0 || day.length === event.numberOfDays) {
            newFilteredBooths = newFilteredBooths.filter((booth) => {
                const attendanceDays = booth.attendance.map((attendance) => attendance.day);
                return attendanceDays.some((attendanceDay) => day.includes(attendanceDay));
            });
        }
        if (text.trim() !== "") {
            const lowerText = text.toLowerCase();
            newFilteredBooths = newFilteredBooths.filter((booth) => {
                return booth.circle && booth.circle.toLowerCase().includes(lowerText);
            });
        }
        setFilteredBooths(newFilteredBooths);
    }, 200), [event, booths]);

    useEffect(() => {
        console.log("Updating filtered booths with text:", filterByText, "and day:", filterByDay);
        updateFilteredBooths({
            text: filterByText,
            day: filterByDay,
        });
    }, [filterByText, filterByDay, updateFilteredBooths]);

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
            <Group
                p={8} pl={16} pr={16}
                align={"center"} justify={"space-between"}
                bg={theme.colors.gray[3]}
                style={{
                    borderRadius: 8,
                }}
            >
                <Group 
                    flex={1}
                    align={"center"}
                    gap={8}
                >
                    <MdSearch size={24} />
                    <TextInput
                        flex={1}
                        placeholder={"輸入關鍵字..."}
                        value={filterByText}
                        onChange={(e) => setFilterByText(e.currentTarget.value)}
                    />
                </Group>
                <Group 
                    flex={2}
                    align={"center"} justify={"flex-end"}
                    gap={8}
                >
                    <MdFilterAlt size={24} />
                    <ButtonGroup
                        orientation="horizontal"
                    >
                        {event.numberOfDays > 1 && range(event.numberOfDays).map((i) => {
                            const day = i+1;
                            return (
                                <Button
                                    key={day}
                                    variant={filterByDay.includes(day) ? "filled" : "outline"}
                                    color={"blue"}
                                    onClick={() => {
                                        if (filterByDay.includes(day)) {
                                            setFilterByDay(filterByDay.filter(d => d !== day));
                                        } else {
                                            setFilterByDay([...filterByDay, day]);
                                        }
                                    }}
                                >
                                    <Text
                                        size={"md"}
                                    >
                                        {day}
                                    </Text>
                                    <Text
                                        size={"xs"}
                                    >
                                        日目
                                    </Text>
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                </Group>
            </Group>
            <Grid
                p={8}
                columns={12}
            >
                {filteredBooths && filteredBooths.map((booth) => {
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