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
                        align={"center"} justify={"flex-start"}
                        pl={"md"} pr={"md"} gap={8}
                    >
                        <Burger
                            opened={opened}
                            onClick={handleBurgerClick}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Text
                            fw={600}
                            style={{
                                fontSize: 24,
                            }}
                        >
                            DoujinEventInfo
                        </Text>
                    </Group>
                </AppShell.Header>
                <AppShell.Main>
                    <Box
                        style={{
                            height: "25%"
                        }}
                    >
                        {children}
                    </Box>
                </AppShell.Main>
            </AppShell>
        </Box>
    );
}