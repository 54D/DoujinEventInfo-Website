import LazyRenderer from '@components/LazyRenderer';
import { useEventData } from '@contexts/EventDataContext';
import { Booth } from '@/types/Booth';
import { Event } from '@/types/Event';
import { Button, ButtonGroup, Grid, Group, Image, Loader, SegmentedControl, Stack, Text, TextInput, Title, UnstyledButton, useMantineTheme } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { lazy, memo, useCallback, useEffect, useState } from 'react';
import { S3DataClient } from '@/utils/S3DataClient';
import { useDebouncedCallback } from '@mantine/hooks';
import { MdCalendarToday, MdFilterAlt, MdSearch, MdSort } from 'react-icons/md';
import { debounce, range } from 'lodash';
import { GoBookmark, GoBookmarkFill, GoHeart, GoHeartFill } from 'react-icons/go';
import useEventUserDataStore from '@/stores/EventUserDataStore';

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
    const {
        isFavouriteBooth, isBookmarkedBooth
    } = useEventUserDataStore(eventId);

    const [loading, setLoading] = useState<boolean>(true);

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
    const [filterByFavourite, setFilterByFavourite] = useState<boolean>(false);
    const [filterByBookmark, setFilterByBookmark] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("default");
    const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
    const updateFilteredBooths = useCallback(debounce(({
        text,
        day,
        favourite,
        bookmark,
        sortBy
    }: {
        text: string;
        day: number[];
        favourite: boolean;
        bookmark: boolean;
        sortBy: string;
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
        if (favourite) {
            newFilteredBooths = newFilteredBooths.filter((booth) => isFavouriteBooth(booth.id));
        }
        if (bookmark) {
            newFilteredBooths = newFilteredBooths.filter((booth) => isBookmarkedBooth(booth.id));
        }
        switch(sortBy) {
            case "default":
                break;
            case "name":
                newFilteredBooths = newFilteredBooths.sort((a, b) => a.circle.localeCompare(b.circle));
                break;
            // It's disgusting but it works
            case "day-1":
            case "day-2":
            case "day-3":
            case "day-4":
            case "day-5":
                const dayNumber = parseInt(sortBy.split("-")[1], 10);
                newFilteredBooths = newFilteredBooths.sort((a, b) => {
                    const aAttendance = a.attendance.find(att => att.day === dayNumber);
                    const bAttendance = b.attendance.find(att => att.day === dayNumber);
                    if (!aAttendance && !bAttendance) return 0;
                    if (!aAttendance) return 1;
                    if (!bAttendance) return -1;
                    return aAttendance.location.localeCompare(bAttendance.location);
                });
                break;
            default:
                break;
        };
        setFilteredBooths(newFilteredBooths);
        setLoading(false);
    }, 500), [event, booths]);

    useEffect(() => {
        setLoading(true);
        updateFilteredBooths({
            text: filterByText,
            day: filterByDay,
            favourite: filterByFavourite,
            bookmark: filterByBookmark,
            sortBy: sortBy,
        });
    }, [filterByText, filterByDay, filterByFavourite, filterByBookmark, sortBy, updateFilteredBooths]);

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
                pos={"sticky"} top={60+8} right={0}
                p={8} pl={16} pr={16}
                align={"center"} justify={"space-between"}
                columns={6}
                style={{
                    zIndex: 5,
                    backgroundColor: "white",
                    borderColor: theme.colors.gray[3],
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderRadius: 8,
                    boxShadow: theme.shadows.sm,
                }}
            >
                <Grid.Col
                    span={{
                        base: 6,
                        xs: 6,
                        sm: 6,
                        md: 2,
                        lg: 2,
                        xl: 2
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
                </Grid.Col>
                <Grid.Col
                    span={{
                        base: 6,
                        xs: 6,
                        sm: 3,
                        md: 2,
                        lg: 2,
                        xl: 2
                    }}
                >
                    <Group
                        flex={1}
                        align={"center"} justify={"flex-end"}
                        gap={8}
                    >
                        <MdSort size={24} />
                        <ButtonGroup>
                            <Button
                                variant={sortBy === "default" ? "filled" : "outline"}
                                onClick={() => setSortBy("default")}
                            >
                                <Text
                                    size={"sm"}
                                >
                                    預設
                                </Text>
                            </Button>
                            <Button
                                variant={sortBy === "name" ? "filled" : "outline"}
                                onClick={() => setSortBy("name")}
                            >
                                <Text
                                    size={"sm"}
                                >
                                    名稱
                                </Text>
                            </Button>
                            {range(event.numberOfDays).map((i) => {
                                const day = i + 1;
                                return (
                                    <Button
                                        key={day}
                                        variant={sortBy === `day-${day}` ? "filled" : "outline"}
                                        onClick={() => setSortBy(`day-${day}`)}
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
                </Grid.Col>
                <Grid.Col
                    span={{
                        base: 6,
                        xs: 6,
                        sm: 3,
                        md: 2,
                        lg: 2,
                        xl: 2
                    }}
                >
                    <Group
                        flex={1}
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
                                        color={"indigo.6"}
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
                        <ButtonGroup
                            orientation="horizontal"
                            >
                            <Button
                                variant={filterByFavourite ? "filled" : "outline"}
                                color={"pink.6"}
                                onClick={() => {
                                    setFilterByFavourite(!filterByFavourite);
                                }}
                            >
                                {filterByFavourite ? <GoHeartFill size={20} /> : <GoHeart size={20} />}
                            </Button>
                            <Button
                                variant={filterByBookmark ? "filled" : "outline"}
                                color={"blue.4"}
                                onClick={() => {
                                    setFilterByBookmark(!filterByBookmark);
                                }}
                            >
                                {filterByBookmark ? <GoBookmarkFill size={20} /> : <GoBookmark size={20} />}
                            </Button>
                        </ButtonGroup>
                    </Group>
                </Grid.Col>
            </Grid>
            <Grid
                p={8}
                columns={12}
                pl={{
                    base: 0,
                    xs: 0,
                    sm: 0,
                    md: 0,
                    lg: 48,
                    xl: 48,
                }}
                pr={{
                    base: 0,
                    xs: 0,
                    sm: 0,
                    md: 0,
                    lg: 48,
                    xl: 48,
                }}
            >
                {filteredBooths && filteredBooths.length > 0 && filteredBooths.map((booth) => {
                    return (
                        <Grid.Col
                            key={booth.id}
                            span={{
                                base: 12,
                                xs: 6,
                                sm: 6,
                                md: 4,
                                lg: 4,
                                xl: 4,
                            }}
                        >
                            <LazyRenderer
                                threshold={0.1}
                                fallback={
                                    <Stack
                                        h={280} w={"100%"}
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
                {!loading && filteredBooths.length === 0 && (
                    <Stack
                        flex={1} justify={"center"} align={"center"}
                    >
                        <Image
                            src={`/pak-gone.jpg`}
                            alt={"No booths found"}
                            h={240} w={240}
                        />
                    </Stack>
                )}
            </Grid>
        </Stack>
    );
}
