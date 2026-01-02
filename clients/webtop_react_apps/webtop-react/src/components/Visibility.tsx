import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";

interface OpacityProps extends BoxProps {
    opacity: number
}

interface ToggleVisibleProps {
    visible: boolean
    children: ReactNode
}

export const Opacity: React.FC<OpacityProps> = (props) => {
    return (
        <Box
            {...props}
            style={
                {
                    opacity: `${props.opacity}`,
                    transitionDuration: "0.3s",
                }
            }>
            {props.children}
        </Box >
    )
}

const ToggleVisible: React.FC<ToggleVisibleProps> = (props) => {
    return <Opacity opacity={props.visible ? 1.0 : 0.0}>
        {props.children}
    </Opacity>
}

export default ToggleVisible;