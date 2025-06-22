import {PropsWithChildren, useMemo} from "react";
import {Box, Stack} from "@mantine/core";
import {useLayoutControl} from "@contexts/LayoutControlContext.tsx";

export type PageSectionProps = PropsWithChildren & {
    fullHeight?: boolean;
    fullWidth?: boolean;
}

export function PageSection({
    children,
    fullHeight = false,
    fullWidth = false,
}: PageSectionProps) {
    const { navbarOpened } = useLayoutControl();

    const horizontalPadding = useMemo(() =>
        fullWidth ? 0 : {
            base: 16,
            xs: 16,
            sm: navbarOpened ? 32 : 64,
            md: navbarOpened ? 32 : 64,
            lg: navbarOpened ? 48 : 96,
            xl: navbarOpened ? 64 : 128,
        }
    , [navbarOpened, fullWidth]);

    const verticalPadding = useMemo(() =>
        fullHeight ? 0 : 16
    , [fullHeight]);

    return (
        <Stack
            gap={16}
            pt={verticalPadding} pb={verticalPadding}
            pl={horizontalPadding} pr={horizontalPadding}
        >
            {children}
        </Stack>
    );

}
