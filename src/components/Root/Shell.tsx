import { AppShell, Box, Burger, Button, Group, NavLink, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { PropsWithChildren, useCallback, useState } from "react";
import { FaCalendar, FaHome, FaQuestion } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { MdHome } from "react-icons/md";
import {useLayoutControl} from "@contexts/LayoutControlContext.tsx";

export function Shell({
    children,
}: PropsWithChildren) {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const {navbarOpened, setNavbarOpened} = useLayoutControl();

    const handleBurgerClick = useCallback(() => {
        setNavbarOpened(!navbarOpened);
    }, [navbarOpened]);

    const NAVBAR_ITEMS = [
        [
            { label: "如何使用", path: "/welcome", icon: <FaQuestion size={16} /> },
        ],
        [
            { label: "場次", path: "/events", icon: <FaCalendar size={16} /> },
        ]
    ]

    return (
        <Box
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: {
                        base: 200,
                        xs: 200,
                        sm: 200,
                        md: 280,
                        lg: 280,
                        xl: 280,
                    },
                    breakpoint: 'xs',
                    collapsed: { desktop: !navbarOpened, mobile: !navbarOpened }
                }}
            >
                <AppShell.Header
                    style={{
                        boxShadow: "4px 4px 8px 4px rgba(200,200,200,0.1)",
                    }}
                >
                    <Group
                        h={"100%"} w={"100%"}
                        align={"center"} justify={"center"}
                        pl={"md"} pr={"md"} gap={8}
                    >
                        <Group
                            flex={1}
                            align={"center"} justify={"flex-start"}
                        >
                            <Burger
                                //opened={opened}
                                onClick={handleBurgerClick}
                                //hiddenFrom="md"
                                size="sm"
                            />
                        </Group>
                        <Group
                            flex={2}
                            align={"center"} justify={"center"}
                        >
                            <Text
                                fw={600}
                                fz={{
                                    base: 16,
                                    xs: 16,
                                    sm: 16,
                                    md: 20,
                                    lg: 20,
                                    xl: 20,
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
                <AppShell.Navbar
                    style={{
                        boxShadow: "4px 4px 8px 4px rgba(200,200,200,0.1)",
                    }}
                >
                    <Stack
                        h={"100%"} w={"100%"}
                        pt={8} pb={8}
                        gap={0}
                    >
                        <NavLink
                            h={36}
                            color={theme.colors.gray[6]}
                            variant={"subtle"}
                            label={<Text fz={"sm"}>主頁</Text>}
                            leftSection={
                                <Group
                                    ml={12}
                                    mr={8}
                                >
                                    <FaHouse size={16} />
                                </Group>
                            }
                            onClick={() => navigate({ to: "/" })}
                        />
                        <Stack gap={8}>
                            {NAVBAR_ITEMS.map((section, index) => (
                                <Stack key={index}>
                                    {section.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            color={theme.colors.gray[6]}
                                            variant={location.pathname === item.path ? "filled" : "subtle"}
                                            label={<Text fz={"sm"}>{item.label}</Text>}
                                            leftSection={
                                                <Group
                                                    ml={12}
                                                    mr={8}
                                                >
                                                    {item.icon}
                                                </Group>
                                            }
                                            onClick={() => navigate({ to: item.path })}
                                        />
                                    ))}
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                </AppShell.Navbar>
                <AppShell.Main>
                    <Box h={"100%"}>
                        {children}
                    </Box>
                </AppShell.Main>
            </AppShell>
        </Box>
    );
}
