import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button, Stack, Text} from "@mantine/core";
import { useEffect } from 'react';
import {PageRoot} from "@components/Page/PageRoot.tsx";
import {PageSection} from "@components/Page/PageSection.tsx";

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();

    return (
        <PageRoot>
            <PageSection fullWidth={true}>
                Test
            </PageSection>
        </PageRoot>
    )
}
