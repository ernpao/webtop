import { Row } from "./Layout";
import TextSubtitle from "./typography/TextSubtitle";
import React, { ReactElement, ReactNode } from "react";

export default function LabelAndIcon({
    text,
    icon,
    variant
}: {
    text: string;
    icon: ReactNode;
    variant: 'filled' | 'sub'
}) {

    const iconClassName = `custom-icon ${variant}`;

    const styledIcon =
        React.isValidElement(icon) && (icon as ReactElement<{ className?: string }>)
            ? React.cloneElement(icon as ReactElement<{ className?: string }>, {
                className: `${(icon as any).props.className ?? ""} ${iconClassName ?? ""}`,
            })
            : icon;

    return (
        <Row alignItems={'center'}>
            {styledIcon}
            <TextSubtitle>{text}</TextSubtitle>
        </Row>
    );
}
