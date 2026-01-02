import { Box, Stack, StackProps } from "@mui/material";
import React, { ReactNode } from "react";
import { useOverflow } from "../hooks/useOverflow";
import { useScrollEdge } from "../hooks/useScrollEdge";

// --- Custom prop interfaces ---
interface Expandable {
    expand?: boolean;
}

interface FullHeight {
    fullHeight?: boolean;
}

interface FullWidth {
    fullWidth?: boolean;
}

interface AxisAlignment {
    crossAxisCenter?: boolean
    mainAxisCenter?: boolean
}

// --- Combined prop interfaces ---
export interface ScreenProps extends StackProps { }

export interface ColumnProps extends StackProps, Expandable, FullWidth, AxisAlignment { }

export interface RowProps extends StackProps, Expandable, FullHeight, AxisAlignment { }

// --- Screen component ---
export const Screen: React.FC<ScreenProps> = (props) => {
    return (
        <Stack {...props} direction="column" width="100dvw" height="100dvh" padding={1}
            className={`custom-screen ${props.className ? props.className : ""}`}
            sx={{
                overflow: 'hidden',
                ...props.sx
            }}
        />
    );
};

// --- Column component ---
export const Column: React.FC<ColumnProps> = ({
    expand,
    fullWidth,
    flexGrow,
    width,
    height,
    crossAxisCenter,
    mainAxisCenter,
    ...muiProps
}) => {
    const _flexGrow = expand ? 1 : flexGrow;
    const _width = fullWidth ? "100%" : width;
    const _height = height ?? "100%";

    return (
        <Stack
            {...muiProps}
            direction="column"
            width={_width}
            height={_height}
            flexGrow={_flexGrow}
            className={`custom-column ${muiProps.className ? muiProps.className : ""}`}
            justifyContent={muiProps.justifyContent ? muiProps.justifyContent : mainAxisCenter ? 'center' : 'start'}
            alignItems={muiProps.alignItems ? muiProps.alignItems : crossAxisCenter ? 'center' : 'start'}
        />
    );
};

// --- Row component ---
export const Row: React.FC<RowProps> = ({
    expand,
    fullHeight,
    flexGrow,
    width,
    height,
    crossAxisCenter,
    mainAxisCenter,
    ...muiProps
}) => {
    const _flexGrow = expand ? 1 : flexGrow;
    const _width = width ?? "100%";
    const _height = fullHeight ? "100%" : height;

    return (
        <Stack
            {...muiProps}
            direction="row"
            width={_width}
            height={_height}
            flexGrow={_flexGrow}
            className={`custom-row ${muiProps.className ? muiProps.className : ""}`}
            justifyContent={muiProps.justifyContent ? muiProps.justifyContent : mainAxisCenter ? 'center' : 'start'}
            alignItems={muiProps.alignItems ? muiProps.alignItems : crossAxisCenter ? 'center' : 'start'}
        />
    );
};

export interface ScrollableListProps extends ColumnProps {
    maxHeight?: string;
    items: ReactNode[];
    onTopReached?: () => void;
    onBottomReached?: () => void;
}

export const ScrollableList: React.FC<ScrollableListProps> = (props) => {
    const {
        children,
        items,
        maxHeight,
        onTopReached,
        onBottomReached,
        className,
        ...columnProps
    } = props;

    const { ref, overflowY } = useOverflow<HTMLDivElement>(); // Used for detecting if the user has scrolled to the end

    useScrollEdge(ref, {
        onTop: onTopReached,
        onBottom: onBottomReached,
    });

    return (
        <Column
            ref={ref}
            {...columnProps}
            maxHeight={maxHeight}
            overflow="scroll"
            sx={{
                scrollbarWidth: overflowY ? "initial" : "none",
                overflowX: 'hidden',
            }}

            className={`custom-scrollable-list ${className ?? ""}`}
            gap="8px"
        >
            {children}
            {items.map((c, i) => (
                <Box
                    key={i}
                    className="custom-scrollable-list-item"
                    width={"95%"}
                    marginRight={overflowY ? "12px" : "initial"}
                    sx={
                        {
                            my: '2px',
                            px: '2px',
                            mx: "auto",
                            overflow: "visible"
                            // maxWidth: "95%",
                        }
                    }
                >
                    {c}
                </Box>
            ))}
        </Column>
    );
};


export interface ScrollableGridProps extends RowProps {
    maxHeight?: string;
    items: ReactNode[];
    onTopReached?: () => void;
    onBottomReached?: () => void;
    columns: 1 | 2 | 3 | 4,
}

export const ScrollableGrid: React.FC<ScrollableGridProps> = (props) => {
    const {
        children,
        items,
        maxHeight,
        onTopReached,
        onBottomReached,
        columns,
        className,
        ...rowProps
    } = props;

    const { ref, overflowY } = useOverflow<HTMLDivElement>(); // Used for detecting if the user has scrolled to the end

    useScrollEdge(ref, {
        onTop: onTopReached,
        onBottom: onBottomReached,
    });

    const itemWidth: string = `${100 / (columns + 0.25)}%`;

    return (
        <Row
            ref={ref}
            {...rowProps}
            maxHeight={maxHeight}
            overflow="scroll"
            flexWrap="wrap"
            justifyContent="center"
            sx={{
                scrollbarWidth: overflowY ? "initial" : "none",
                overflowX: 'hidden',
            }}

            className={`custom-scrollable-grid ${className ?? ""}`}
            gap="8px"
        >
            {children}
            {items.map((c, i) => (
                <Box
                    key={i}
                    className="custom-scrollable-grid-item"
                    width={itemWidth}
                    marginRight={overflowY ? "12px" : "initial"}
                    sx={
                        {
                            my: '16px',
                            px: '2px',
                            // mx: "auto",
                            overflow: "visible"
                            // maxWidth: "95%",
                        }
                    }
                >
                    {c}
                </Box>
            ))
            }
        </Row >
    );
};


export interface TwoHalvesProps extends RowProps {
    reverse?: boolean,
    leftWidth?: string,
    leftContent: ReactNode,
    rightContent: ReactNode,
    itemSpacing?: number | string,
}

export const TwoHalves: React.FC<TwoHalvesProps> = ({
    expand,
    fullHeight,
    flexGrow,
    width,
    height,
    crossAxisCenter,
    mainAxisCenter,
    reverse,
    leftWidth,
    leftContent,
    rightContent,
    itemSpacing,
    ...muiProps
}) => {
    const _flexGrow = expand ? 1 : flexGrow;
    const _width = width ?? "100%";
    const _height = fullHeight ? "100%" : height;


    const lWidth = leftWidth ? leftWidth : "50%"
    const rWidthStr = `calc(100% - ${lWidth})`

    return (
        <>
            <Stack
                useFlexGap
                gap={itemSpacing ?? 3}
                {...muiProps}
                direction="row"
                width={_width}
                height={_height}
                flexGrow={_flexGrow}
                className={`custom-two-halves ${reverse ? "reversed" : ""} ${muiProps.className ? muiProps.className : ""}`}
                justifyContent={muiProps.justifyContent ? muiProps.justifyContent : mainAxisCenter ? 'center' : 'start'}
                alignItems={muiProps.alignItems ? muiProps.alignItems : crossAxisCenter ? 'center' : 'start'}
            >
                <Box className='left' width={lWidth}>{leftContent}</Box>
                <Box className='right' width={rWidthStr}>{rightContent}</Box>

            </Stack>
        </>
    );
}