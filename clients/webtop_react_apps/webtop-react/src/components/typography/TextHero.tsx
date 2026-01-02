
interface TextHeroProps {
    children: React.ReactNode,
    textAlign?: 'left' | 'right' | 'center'
    fontSize?: string
    lineHeight?: string
    className?: string
}


export default function TextHero({ children, textAlign = 'left', fontSize = "32px", lineHeight, className }: TextHeroProps) {
    return (<>
        <h1 className={`text-hero ${className ? className : ''}`} style={{
            textAlign: textAlign,
            fontSize: fontSize,
            lineHeight: lineHeight ?? fontSize
        }}>
            {children}
        </h1>
    </>)
}