
// TODO
import {PropsWithChildren, ReactNode} from "react";
import {Stack} from "@mantine/core";

export function PageRoot({
    children,
}: PropsWithChildren) {

    return (
        <Stack
            h={"100%"} w={"100%"}
            pt={16}
        >
            {children}
        </Stack>
    );

}
