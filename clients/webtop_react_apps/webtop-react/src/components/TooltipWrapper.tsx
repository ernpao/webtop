import { Kbd, Tooltip } from "@heroui/react"
import { ReactNode, useMemo } from "react"
import TextSubtitle from "./typography/TextSubtitle"
import { Column, Row } from "./Layout"
import { Box } from "@mui/material"

interface TooltipWrapperProps {
    className?: string
    content: ReactNode
    children: ReactNode
    wrapInTextSubtitle?: boolean
    delay?: number
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ className = '', content, wrapInTextSubtitle = true, delay = 500, children }: TooltipWrapperProps) => {

    const finalTooltipContent = useMemo(() => wrapInTextSubtitle ? <TextSubtitle className="text-center">{content}</TextSubtitle> : content, [wrapInTextSubtitle, content])

    return <Tooltip className={`custom-tooltip-wrapper ${className}`} content={<Box padding={1}>{finalTooltipContent}</Box>} radius='sm' delay={delay} >
        {children}
    </Tooltip>

}

export default TooltipWrapper

interface TooltipWrapperWithHotkeyProps {
    className?: string
    description: string,
    hotkey: string,
    children: ReactNode,
    wrapInTextSubtitle?: boolean,
    delay?: number

}

export const TooltipWrapperWithHotkey: React.FC<TooltipWrapperWithHotkeyProps> = ({ className = '', description, hotkey, wrapInTextSubtitle = true, delay = 500, children }: TooltipWrapperWithHotkeyProps) => {
    return <TooltipWrapper
        wrapInTextSubtitle={wrapInTextSubtitle}
        delay={delay}
        content={
            <Column className={`custom-tooltip-wrapper ${className}`} crossAxisCenter>
                <div>
                    {description}
                </div>
                <Row mainAxisCenter>
                    <div>Hotkey:</div>
                    <div>
                        <Kbd style={{ fontSize: '0.7rem', lineHeight: '0.7rem' }}>{hotkey.toUpperCase()}</Kbd>
                    </div>
                </Row>
            </Column>
        }>
        {children}
    </TooltipWrapper>
}

