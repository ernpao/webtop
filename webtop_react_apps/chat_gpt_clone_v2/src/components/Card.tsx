import { Card as HeroUICard } from "@heroui/react";
import { ReactNode, CSSProperties } from "react";

interface CardProps {
    children: ReactNode
    fullWidth?: boolean
    style?: CSSProperties

}

export default function Card({ children, fullWidth, style }: CardProps) {
    return (
        <HeroUICard
            className="custom-card"
            fullWidth={fullWidth}
            style={style}
        >
            {children}
        </HeroUICard>
    )
}