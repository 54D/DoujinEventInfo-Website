import {
    Badge,
    Box,
    getGradient,
    Group,
    Image,
    Pill,
    Space,
    Stack,
    Text,
    useMantineTheme
} from "@mantine/core";
import {Event} from "@/types/Event";
import dayjs from "dayjs";
import {useCallback, useEffect, useMemo} from "react";

type EventCardProps = {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const theme = useMantineTheme();

    const timeDisplayBackground = useMemo(() => {
        const now = dayjs();
        const start = dayjs(event.startTime);
        const end = dayjs(event.endTime);
        if (now.isBefore(start)) {
            if (start.diff(now, "day") > 7) {
                return getGradient({
                    from: "blue.4",
                    to: "blue.8",
                    deg: 135,
                }, theme);
            }
            return getGradient({
                from: "blue.4",
                to: "green.8",
                deg: 135,
            }, theme);
        }
        if (now.isBefore(end)) {
            return getGradient({
                from: "green.4",
                to: "green.8",
                deg: 135,
            }, theme);
        }
        return getGradient({
            from: "gray.3",
            to: "gray.4",
            deg: 135,
        }, theme);
    }, [event, theme]);

    const timeDisplayTextColor = useMemo(() => {
        const now = dayjs();
        const start = dayjs(event.startTime);
        const end = dayjs(event.endTime);
        if (now.isAfter(end)) {
            return "gray";
        }
        return "white";
    }, [event]);

    const ageRatingBackgruond = useMemo(() => {
        if (event.ageRating === "G") {
            return "blue";
        }
        if (event.ageRating === "R15") {
            return "yellow";
        }
        if (event.ageRating === "R18") {
            return "red";
        }
        if (event.ageRating === "R18G") {
            return "red";
        }
        return "gray";
    }, [event]);

    return (
        <Stack
            h={"100%"} w={"100%"}
            gap={0}
            style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
            }}
        >
            <Box
                bg={"grey"}
                style={{
                    position: "absolute", top: 0, left: 0,
                    height: "100%", width: "100%",
                    overflow: "hidden",
                }}
            >
                <Image
                    src={"/data/events/" + event.id + "/eventCover.jpg"}
                    alt={event.nameEnUS}
                    h={"100%"} w={"100%"}
                    fit={"cover"}
                />
            </Box>
            <Stack
                pos={"absolute"} bottom={0} left={0}
                h={"100%"} w={"100%"}
                p={16} gap={0}
                style={{
                    zIndex: 1,
                    overflow: "hidden",
                    backgroundImage: "linear-gradient(to bottom, rgba(200,200,200,0.4) 5%, rgba(160,160,160,0.7) 60%, rgba(80,80,80,0.9) 90%)",
                }}
            >
                <Box flex={4}/>
                <Stack
                    flex={2}
                >
                    <Group
                        align={"baseline"} justify={"center"}
                        pl={8} pr={8}
                        gap={0}
                        style={{
                            borderRadius: 8,
                            background: timeDisplayBackground,
                            color: timeDisplayTextColor,
                        }}
                    >
                        <Text fw={600} size={"xs"}>
                            {dayjs(event.startTime).format("MMM").toLocaleUpperCase()}
                        </Text>
                        <Text fw={600}>
                            {dayjs(event.startTime).format("D").toLocaleUpperCase()}
                        </Text>
                        {!dayjs(event.startTime).startOf("day").isSame(dayjs(event.endTime).startOf("day")) && (<>
                            <Text>-</Text>
                            <Text fw={600} size={"xs"}>
                                {dayjs(event.endTime).format("MMM").toLocaleUpperCase()}
                            </Text>
                            <Text fw={600}>
                                {dayjs(event.endTime).format("D").toLocaleUpperCase()}
                            </Text>
                        </>)}
                        {dayjs().isBefore(dayjs(event.startTime)) && dayjs().isBefore(dayjs(event.endTime)) && (<>
                            <Space/>
                            <Text fw={600}>
                                ·
                            </Text>
                            <Space/>
                            <Text fw={600} size={"sm"} tt={"uppercase"}>
                                Upcoming
                            </Text>
                        </>)}
                        {dayjs().isAfter(dayjs(event.startTime)) && dayjs().isBefore(dayjs(event.endTime)) && (<>
                            <Space/>
                            <Text fw={600}>
                                ·
                            </Text>
                            <Space/>
                            <Text fw={600} size={"sm"} tt={"uppercase"}>
                                Ongoing
                            </Text>
                        </>)}
                        {dayjs().isAfter(dayjs(event.endTime)) && (<>
                            <Space/>
                            <Text fw={600}>
                                ·
                            </Text>
                            <Space/>
                            <Text fw={600} size={"sm"} tt={"uppercase"}>
                                Ended
                            </Text>
                        </>)}
                    </Group>
                    <Text
                        fw={600}
                        c={"white"}
                        style={{
                            fontSize: 32,
                            textShadow: "0 0 4px rgba(0,0,0,1)",
                        }}
                    >
                        {event.nameEnUS}
                    </Text>
                    <Group
                        gap={8}
                        align={"flex-start"} justify={"flex-start"}
                    >
                        <Badge
                            variant={"filled"}
                            color={ageRatingBackgruond}
                        >
                            {event.ageRating}
                        </Badge>
                    </Group>
                </Stack>
            </Stack>
        </Stack>
    );
}
