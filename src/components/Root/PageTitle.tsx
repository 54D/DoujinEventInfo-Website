import { Stack, Button, Title } from "@mantine/core";
import { ReactNode } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";

export type PageTitleProps = {
    title?: string | ReactNode;
    showBackButton?: boolean;
    onBackButtonClick?: () => void;
}

export function PageTitle({
    title,
    showBackButton = false,
    onBackButtonClick,
}: PageTitleProps) {
    return (
        <Stack
            gap={8}
        >
            {showBackButton && <Button
                variant={"subtle"}
                w={"min-content"} h={24}
                p={4}
                leftSection={<MdKeyboardArrowLeft/>}
                onClick={onBackButtonClick}
            >
                Back
            </Button>}
            { typeof title === "string" ? (
                <Title
                    order={1}
                >
                    {title}
                </Title>
            ) : (
                title
            )}
        </Stack>
    );
}