import { AppShell, Box, Burger, Group, Text, Title, useMantineTheme } from "@mantine/core";
import { PropsWithChildren, useCallback, useState } from "react";

export function Shell({
    children,
}: PropsWithChildren) {
    const theme = useMantineTheme();
    
    const [opened, setOpened] = useState(false);
    const handleBurgerClick = useCallback(() => {
        setOpened(!opened);
    }, [opened]);

    return (
        <Box
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <AppShell
                header={{ height: 60 }}
                navbar={{ width: 0, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                padding={"md"}
            >
                <AppShell.Header>
                    <Group
                        h={"100%"} w={"100%"}
                        align={"center"} justify={"center"}
                        pl={"md"} pr={"md"} gap={8}
                        style={{
                            boxShadow: theme.shadows.sm
                        }}
                    >
                        <Group
                            flex={1}
                            align={"center"} justify={"flex-start"}
                        >
                            <Burger
                                opened={opened}
                                onClick={handleBurgerClick}
                                hiddenFrom="sm"
                                size="sm"
                            />
                        </Group>
                        <Group
                            flex={1}
                            align={"center"} justify={"center"}
                        >
                            <Text
                                fw={600}
                                style={{
                                    fontSize: 24,
                                }}
                            >
                                同人活動資訊（試行中）
                            </Text>
                        </Group>
                        <Group
                            flex={1}
                            align={"center"} justify={"flex-end"}
                        >
                        </Group>
                    </Group>
                </AppShell.Header>
                <AppShell.Main>
                    <Box
                        pl={"10%"} pr={"10%"}
                        style={{
                            height: "100%"
                        }}
                    >
                        {children}
                    </Box>
                </AppShell.Main>
            </AppShell>
        </Box>
    );
}