import {Event} from "@/types/Event.ts";
import {ActionIcon, Box, getGradient, getThemeColor, Group, Image, Stack, Text, Title, useMantineTheme} from "@mantine/core";
import {Booth} from "@/types/Booth.ts";
import {useCallback, useMemo, useState} from "react";
import useEventUserDataStore, { PlannedBoothStage } from "@stores/EventUserDataStore";
import { GoBookmark, GoBookmarkFill, GoHeart, GoHeartFill } from "react-icons/go";
import { MdCheckCircle, MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { S3DataClient } from "@/utils/S3DataClient";

type BoothCardProps = {
    event: Event;
    booth: Booth;
    layout: "list" | "grid";
}

export function BoothCard({ event, booth, layout }: BoothCardProps) {
    const theme = useMantineTheme();
    const darkThemeColor = useMemo(() => getThemeColor("dark", theme), [theme]);
    const indigoThemeColor = useMemo(() => getThemeColor("indigo", theme), [theme]);
    const { 
        isFavouriteBooth, addFavouriteBooth, removeFavouriteBooth,
        isBookmarkedBooth, addBookmarkedBooth, removeBookmarkedBooth,
        isPlannedBooth, setPlannedBooth, removePlannedBooth,
     } = useEventUserDataStore(event.id);

    const [imageIsValid, setImageIsValid] = useState(true);

    return (<>
        {layout === "grid" && (
            <Stack
                h={280} w={"100%"}
                gap={0}
                style={{
                    background: theme.colors.gray[3],
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: [
                        ...(isFavouriteBooth(booth.id) ? [`8px 6px 24px -12px ${theme.colors.pink[6]}`] : []),
                        ...(isBookmarkedBooth(booth.id) ? [`8px 6px 24px -12px ${theme.colors.blue[4]}`] : []),
                        ...(isPlannedBooth(booth.id) === PlannedBoothStage.INTERESTED ? [`-8px -6px 24px -12px ${theme.colors.orange[6]}`] : []),
                        ...(isPlannedBooth(booth.id) === PlannedBoothStage.VISITED ? [`-8px -6px 24px -12px ${theme.colors.green[6]}`] : []),
                    ].join(", "),
                    opacity: isPlannedBooth(booth.id) === PlannedBoothStage.VISITED ? 0.5 : 1,
                    transition: "all 0.2s ease-out",
                }}
            >
                <Stack
                    pos={"relative"}
                    h={140} w={"100%"}
                    bg={"dark.4"}
                >
                    <Box
                        bg={"grey"}
                        style={{
                            position: "absolute", top: 0, left: 0,
                            height: "100%", width: "100%",
                            overflow: "hidden",
                        }}
                    >
                        { booth.coverImageName && <Image
                            src={S3DataClient.getEventAssetUrl(event.id, booth.coverImageName)}
                            alt={booth.circle}
                            onError={() => {
                                setImageIsValid(false);
                            }}
                            h={"100%"} w={"100%"}
                            fit={"cover"}
                            style={{
                                opacity: 0.4,
                                //opacity: imageIsValid ? 1 : 0.4
                            }}
                        />}
                    </Box>
                    <Group
                        pos={"absolute"} top={0} left={0}
                        w={"100%"} h={40}
                        p={8}
                        gap={4}
                        align={"center"} justify={"flex-start"}
                        style={{
                            backgroundImage: "linear-gradient(to top, rgba(120,120,120,0) 0%, rgba(80,80,80,0.5) 60%)",
                        }}
                    >
                        { !isPlannedBooth(booth.id) ? (
                            <ActionIcon
                                variant="transparent"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setPlannedBooth(booth.id, PlannedBoothStage.INTERESTED)
                                }}
                            >
                                <MdOutlineRadioButtonUnchecked
                                    size={40}
                                    color={"white"}
                                />
                            </ActionIcon>
                        ) : isPlannedBooth(booth.id) === PlannedBoothStage.INTERESTED ? (
                            <ActionIcon
                                variant="transparent"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setPlannedBooth(booth.id, PlannedBoothStage.VISITED)
                                }}
                            >
                                <MdOutlineRadioButtonChecked
                                    size={40}
                                    color={theme.colors.orange[6]}
                                />
                            </ActionIcon>
                        ) : (
                            <ActionIcon
                                variant="transparent"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    removePlannedBooth(booth.id);
                                }}
                            >
                                <MdCheckCircle
                                    size={40}
                                    color={theme.colors.green[6]}
                                />
                            </ActionIcon>   
                        )}
                    </Group>
                    <Group
                        pos={"absolute"} bottom={0} left={0}
                        w={"100%"} h={40}
                        p={8}
                        gap={4}
                        align={"center"} justify={"flex-end"}
                        style={{
                            backgroundImage: "linear-gradient(to bottom, rgba(120,120,120,0) 0%, rgba(80,80,80,0.5) 60%)",
                        }}
                    >
                        { isFavouriteBooth(booth.id) ? (
                            <ActionIcon
                                variant="transparent"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    removeFavouriteBooth(booth.id);
                                }}
                            >
                                <GoHeartFill
                                    size={40}
                                    color={theme.colors.pink[6]}
                                />
                            </ActionIcon>
                        ) : (
                            <ActionIcon
                                variant="transparent"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    addFavouriteBooth(booth.id);
                                }}
                            >
                                <GoHeart
                                    size={40}
                                    color={"white"}
                                />
                            </ActionIcon>
                        )}
                        { isBookmarkedBooth(booth.id) ? (
                            <ActionIcon
                                variant="transparent"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    removeBookmarkedBooth(booth.id);
                                }}
                            >
                                <GoBookmarkFill
                                    size={40}
                                    color={theme.colors.blue[4]}
                                />
                            </ActionIcon>
                        ) : (
                            <ActionIcon
                                variant="transparent"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    addBookmarkedBooth(booth.id);
                                }}
                            >
                                <GoBookmark
                                    size={40}
                                    color={"white"}
                                />
                            </ActionIcon>
                        )}
                    </Group>
                </Stack>
                <Stack
                    flex={1}
                    p={8} gap={0}
                >
                    <Stack
                        flex={1}
                    >
                        <Text
                            fw={600}
                            c={"black"}
                            style={{
                                fontSize: 28,
                                //textShadow: "0 0 4px rgba(255,255,255,1)",
                            }}
                        >
                            {booth.circle}
                        </Text>
                    </Stack>
                    <Group
                        gap={8}
                        align={"flex-end"} justify={"flex-end"}
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
                                            size={"md"} c={"white"}
                                        >
                                            {attendance.day}
                                        </Text>
                                        <Text
                                            size={"xs"} c={"white"}
                                        >
                                            日目
                                        </Text>
                                    </Group>
                                    <Group
                                        p={2}
                                        gap={0}
                                        style={{
                                            backgroundColor: darkThemeColor,
                                            borderTopRightRadius: 8,
                                            borderBottomRightRadius: 8,
                                            borderColor: indigoThemeColor,
                                            borderTopStyle: "solid",
                                            borderRightStyle: "solid",
                                            borderBottomStyle: "solid",
                                        }}
                                    >
                                        <Text
                                            size={"md"} fw={600} c={"white"}
                                        >
                                            {attendance.location}
                                        </Text>
                                        {attendance.isBorrowed && <Text
                                            size={"xs"} c={"lightgray"}
                                        >
                                            (借)
                                        </Text>}
                                    </Group>
                                </Group>
                            )
                        })}
                    </Group>
                </Stack>
            </Stack>
        )}
    </>);
}
