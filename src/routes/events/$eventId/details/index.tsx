import { Stack } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/details/')({
  component: RouteComponent,
})

function RouteComponent() {
return <div></div>
}
