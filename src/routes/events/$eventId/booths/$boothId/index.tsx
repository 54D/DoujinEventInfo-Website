import { PageTitle } from '@components/Page/PageTitle.tsx'
import { useEventData } from '@/contexts/EventDataContext';
import { Event } from '@/types/Event';
import { Booth } from '@/types/Booth';
import { S3DataClient } from '@/utils/S3DataClient';
import { Stack, Group, getGradient, Box, Image, Text, Title, useMantineTheme, getThemeColor, Button, ButtonGroup, Pill, Badge, rem, Grid, Textarea } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react';
import { MdCheckCircle, MdInfo, MdNote, MdNotes, MdOutlineRadioButtonChecked, MdTag } from 'react-icons/md';
import { BiSolidNotepad } from 'react-icons/bi';
import { GoBookmark, GoBookmarkFill, GoHeart, GoHeartFill } from 'react-icons/go';
import useEventUserDataStore, { PlannedBoothStage } from '@stores/EventUserDataStore';
import { FaFacebook, FaNoteSticky, FaPixiv, FaXTwitter } from 'react-icons/fa6';
import { FaInstagram, FaLink, FaTag } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import {PageRoot} from "@components/Page/PageRoot.tsx";
import {PageSection} from "@components/Page/PageSection.tsx";

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
    const {
        isFavouriteBooth, addFavouriteBooth, removeFavouriteBooth,
        isBookmarkedBooth, addBookmarkedBooth, removeBookmarkedBooth,
        isPlannedBooth, setPlannedBooth, removePlannedBooth,
        setBoothNote, getBoothNote, removeBoothNote,
     } = useEventUserDataStore(eventId);

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
        <PageRoot>
            <PageSection>
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
                        boxShadow: [
                            ...(isFavouriteBooth(booth.id) ? [`8px 6px 24px -12px ${theme.colors.pink[6]}`] : []),
                            ...(isBookmarkedBooth(booth.id) ? [`8px 6px 24px -12px ${theme.colors.blue[4]}`] : []),
                            ...(isPlannedBooth(booth.id) === PlannedBoothStage.INTERESTED ? [`-8px -6px 24px -12px ${theme.colors.orange[6]}`] : []),
                            ...(isPlannedBooth(booth.id) === PlannedBoothStage.VISITED ? [`-8px -6px 24px -12px ${theme.colors.green[6]}`] : []),
                            theme.shadows.md,
                        ].join(", "),
                        transition: "box-shadow 0.2s ease-out",
                    }}
                >
                    <Box
                        bg={theme.colors.gray[1]}
                        style={{
                            flex: 1,
                            height: "100%", width: "100%",
                            overflow: "hidden",
                            borderRadius: 8,
                        }}
                    >
                        {booth.coverImageName && <Image
                            src={S3DataClient.getEventAssetUrl(event.id, booth.coverImageName)}
                            alt={event.nameEnUS}
                            h={"100%"} w={"100%"}
                            fit={"contain"}
                            style={{
                                borderRadius: 8,
                                overflow: "hidden",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        />}
                    </Box>
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
                            flex={2}
                            fw={600}
                            fz={48}
                            style={{
                                WebkitTextStroke: "1px rgba(80,80,80,0.5)",
                                textShadow: "0 0 4px rgba(255,255,255,1)",
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
                                            p={4}
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
                                                fz={"xl"} c={"white"}
                                            >
                                                {attendance.day}
                                            </Text>
                                            <Text
                                                fz={"sm"} c={"white"}
                                            >
                                                日目
                                            </Text>
                                        </Group>
                                        <Group
                                            pt={12} pb={12} pl={2} pr={2}
                                            gap={0}
                                            align={"center"} justify={"center"}
                                            style={{
                                                minWidth: 64,
                                                minHeight: 64,
                                                backgroundColor: darkThemeColor,
                                                borderRadius: 8,
                                                borderColor: indigoThemeColor,
                                                borderStyle: "solid",
                                            }}
                                        >
                                            <Text
                                                fw={600} c={"white"}
                                                fz={28}
                                            >
                                                {attendance.location}
                                            </Text>
                                            {attendance.isBorrowed && <Text
                                                fz={"xl"} c={"lightgray"}
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
            </PageSection>
            <PageSection>
                <Grid
                    w={"100%"}
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
                    columns={3}
                >
                    <Grid.Col
                        span={{
                            base: 3,
                            xs: 3,
                            sm: 3,
                            md: 2,
                            lg: 2,
                            xl: 2,
                        }}
                        order={{
                            base: 2,
                            xs: 2,
                            sm: 2,
                            md: 1,
                            lg: 1,
                            xl: 1,
                        }}
                    >
                        <Stack>
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
                                <FaTag size={20}/>
                                <Title
                                    order={4}
                                >
                                    Tags
                                </Title>
                            </Group>
                            <Group
                                w={"100%"}
                            >
                                {booth.tags.map((tag) => (
                                    <Group
                                        key={tag}
                                        bg={theme.colors.gray[3]}
                                        p={4} pl={16} pr={16}
                                        style={{
                                            borderRadius: 16,
                                            cursor: "default"
                                        }}
                                    >
                                        <Text>
                                            {tag}
                                        </Text>
                                    </Group>
                                ))}
                            </Group>
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
                                <FaLink size={20}/>
                                <Title
                                    order={4}
                                >
                                    Links
                                </Title>
                            </Group>
                            <Group
                                w={"100%"}
                            >
                                {booth.links.map((link) => (
                                    <Button
                                        key={link.url}
                                        variant={"outline"}
                                        leftSection={
                                            link.category === "facebook" ? <FaFacebook size={20}/>
                                            : link.category === "twitter" ? <FaXTwitter size={20}/>
                                            : link.category === "instagram" ? <FaInstagram size={20}/>
                                            : link.category === "pixiv" ? <FaPixiv size={20}/>
                                            : link.category === "homepage" ? <IoPerson size={20}/>
                                            : <FaLink size={20}/>
                                        }
                                        color={
                                            link.category === "facebook" ? "blue.6"
                                            : link.category === "twitter" ? "gray.9"
                                            : link.category === "instagram" ? "pink.6"
                                            : link.category === "pixiv" ? "blue.4"
                                            : link.category === "homepage" ? "gray.7"
                                            : "blue"
                                        }
                                        onClick={() => {
                                            window.open(link.url);
                                        }}
                                    >
                                        <Text>
                                            {link.name}
                                        </Text>
                                    </Button>
                                ))}
                            </Group>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col
                        span={{
                            base: 3,
                            xs: 3,
                            sm: 3,
                            md: 1,
                            lg: 1,
                            xl: 1,
                        }}
                        order={{
                            base: 1,
                            xs: 1,
                            sm: 1,
                            md: 2,
                            lg: 2,
                            xl: 2,
                        }}
                    >
                        <Stack>
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
                                <FaNoteSticky size={20}/>
                                <Title
                                    order={4}
                                >
                                    My notes
                                </Title>
                            </Group>
                            <Stack
                                w={"100%"}
                                pl={8} pr={8}
                                align={"center"} justify={"center"}
                                style={{
                                    borderRadius: 8,
                                }}
                            >
                                <ButtonGroup
                                    w={"100%"}
                                    orientation="horizontal"
                                >
                                    { isPlannedBooth(booth.id) === PlannedBoothStage.INTERESTED ? (
                                        <Button
                                            w={"100%"}
                                            key={"interested"}
                                            gradient={{ from: "orange.6", to: "orange.8" }}
                                            variant={"gradient"}
                                            rightSection={<MdOutlineRadioButtonChecked size={20} color={"white"}/>}
                                            onClick={() => {
                                                removePlannedBooth(booth.id);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    ) : (
                                        <Button
                                            w={"100%"}
                                            key={"interested"}
                                            color={"orange"}
                                            variant={"outline"}
                                            rightSection={<MdOutlineRadioButtonChecked size={20} color={theme.colors.orange[6]}/>}
                                            onClick={() => {
                                                setPlannedBooth(booth.id, PlannedBoothStage.INTERESTED);
                                            }}
                                        >
                                            Mark as
                                        </Button>
                                    )}
                                    { isPlannedBooth(booth.id) === PlannedBoothStage.VISITED ? (
                                        <Button
                                            w={"100%"}
                                            key={"visited"}
                                            gradient={{ from: "green.6", to: "green.8" }}
                                            variant={"gradient"}
                                            rightSection={<MdCheckCircle size={20} color={"white"}/>}
                                            onClick={() => {
                                                removePlannedBooth(booth.id);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    ) : (
                                        <Button
                                            w={"100%"}
                                            key={"visited"}
                                            color={"green"}
                                            variant={"outline"}
                                            rightSection={<MdCheckCircle size={20} color={theme.colors.green[6]}/>}
                                            onClick={() => {
                                                setPlannedBooth(booth.id, PlannedBoothStage.VISITED);
                                            }}
                                        >
                                            Mark as
                                        </Button>
                                    )}
                                </ButtonGroup>
                                <ButtonGroup
                                    w={"100%"}
                                    orientation="horizontal"
                                >
                                    {isFavouriteBooth(booth.id) ? (
                                        <Button
                                            w={"100%"}
                                            key={"favourites"}
                                            gradient={{ from: "pink.6", to: "pink.8" }}
                                            variant={"gradient"}
                                            rightSection={<GoHeartFill size={20} color={"white"}/>}
                                            onClick={() => {
                                                removeFavouriteBooth(booth.id);
                                            }}
                                        >
                                            Remove from
                                        </Button>
                                    ) : (
                                        <Button
                                            w={"100%"}
                                            key={"favourites"}
                                            color={"pink"}
                                            variant={"outline"}
                                            rightSection={<GoHeart size={20} color={theme.colors.pink[6]}/>}
                                            onClick={() => {
                                                addFavouriteBooth(booth.id);
                                            }}
                                        >
                                            Add to
                                        </Button>
                                    )}
                                    {isBookmarkedBooth(booth.id) ? (
                                        <Button
                                            w={"100%"}
                                            key={"planned"}
                                            gradient={{ from: "blue.4", to: "blue.6" }}
                                            variant={"gradient"}
                                            rightSection={<GoBookmarkFill size={20} color={"white"}/>}
                                            onClick={() => {
                                                removeBookmarkedBooth(booth.id);
                                            }}
                                        >
                                            Remove from
                                        </Button>
                                    ) : (
                                        <Button
                                            w={"100%"}
                                            key={"planned"}
                                            color={"blue"}
                                            variant={"outline"}
                                            rightSection={<GoBookmark size={20} color={theme.colors.blue[4]}/>}
                                            onClick={() => {
                                                addBookmarkedBooth(booth.id);
                                            }}
                                        >
                                            Add to
                                        </Button>
                                    )}
                                </ButtonGroup>
                                <Textarea
                                    w={"100%"}
                                    placeholder="Write your notes here..."
                                    autosize
                                    minRows={4}
                                    maxRows={4}
                                    maxLength={500}
                                    value={getBoothNote(booth.id) || ""}
                                    onChange={(e) => {
                                        setBoothNote(booth.id, e.currentTarget.value);
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </PageSection>
        </PageRoot>
    )

}
