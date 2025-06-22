import {PropsWithChildren, useMemo} from "react";
import {Box, Stack} from "@mantine/core";
import {useLayoutControl} from "@contexts/LayoutControlContext.tsx";

export type PageSectionProps = PropsWithChildren & {
    fullWidth?: boolean;
}

export function PageSection({
    children,
    fullWidth = false,
}: PageSectionProps) {
    const { navbarOpened } = useLayoutControl();

    const padding = useMemo(() =>
        fullWidth ? 0 : {
            base: 16,
            xs: 16,
            sm: navbarOpened ? 32 : 64,
            md: navbarOpened ? 32 : 64,
            lg: navbarOpened ? 48 : 96,
            xl: navbarOpened ? 64 : 128,
        }
    , [navbarOpened, fullWidth]);

    return (
        <Stack
            gap={16}
            pt={0} pb={0}
            pl={padding} pr={padding}
        >
            {children}
        </Stack>
    );

}
