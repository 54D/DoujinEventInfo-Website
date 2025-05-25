import {Badge, Chip, createTheme, Text} from "@mantine/core";

export const Theme = createTheme({
    colors: {
        'blue': [
            "#e5f3ff",
            "#cde2ff",
            "#9ac2ff",
            "#64a0ff",
            "#3884fe",
            "#1d72fe",
            "#0969ff",
            "#0058e4",
            "#004ecd",
            "#0043b5"
        ]
    },
    primaryColor: "indigo",
    primaryShade: 7,
    defaultGradient: {
        from: "blue",
        to: "indigo",
        deg: 135
    },
    components: {
        Text: Text.extend({
            defaultProps: {
                lh: 1.2
            }
        }),
        Badge: Badge.extend({
            styles: {
                root: {
                    borderRadius: 8,
                }
            }
        })
    }
});
