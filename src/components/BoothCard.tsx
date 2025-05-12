import {Event} from "@/types/Event.ts";
import {Box, getGradient, getThemeColor, Group, Image, Stack, Text, Title, useMantineTheme} from "@mantine/core";
import {Booth} from "@/types/Booth.ts";
import {useMemo, useState} from "react";

type BoothCardProps = {
    event: Event;
    booth: Booth;
    layout: "list" | "grid";
}

export function BoothCard({ event, booth, layout }: BoothCardProps) {
    const theme = useMantineTheme();
    const darkThemeColor = useMemo(() => getThemeColor("dark", theme), [theme]);
    const indigoThemeColor = useMemo(() => getThemeColor("indigo", theme), [theme]);
    const backgroundGradient = useMemo(() => getGradient({
        from: "gray.3",
        to: "gray.4",
        deg: 135,
    }, theme), [theme]);

    const [imageIsValid, setImageIsValid] = useState(true);

    {/*}
    return (
        <Stack
            h={240} w={"100%"}
            gap={0}
            style={{
                background: backgroundGradient,
                borderRadius: 8,
                overflow: "hidden",
            }}
        >
            <Text>
                {booth.circle}
            </Text> 
        </Stack>
    );
    */}

    return (<>
        {layout === "grid" && (
            <Stack
                h={240} w={"100%"}
                gap={0}
                style={{
                    background: backgroundGradient,
                    borderRadius: 8,
                    overflow: "hidden",
                }}
            >
                <Stack
                    h={120} w={"100%"}
                    bg={"dark.4"}
                >
                    <Image
                        //src={"/data/events/" + event.id + "/boothCovers/" + booth.id + ".jpg"}
                        src={"/data/events/" + event.id + "/eventCover.jpg"}
                        alt={booth.circle}
                        //fallbackSrc={"/data/events/" + event.id + "/eventCover.jpg"}
                        onError={() => {
                            setImageIsValid(false);
                        }}
                        h={120} w={"100%"}
                        fit={"cover"}
                        style={{
                            opacity: 0.4,
                            //opacity: imageIsValid ? 1 : 0.4
                        }}
                    />
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
                                fontSize: 24,
                                textShadow: "0 0 4px rgba(255,255,255,1)",
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
                                            size={"sm"} c={"white"}
                                        >
                                            {attendance.day + "日目"}
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
                                            size={"sm"} fw={600} c={"white"}
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
