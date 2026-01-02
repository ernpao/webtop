interface TextSubtitleProps {
    children: React.ReactNode,
    className?: string
}
export default function TextSubtitle({ children, className }: TextSubtitleProps) {
    return (<>
        <span className={`text-subtitle ${className ? className : ''}`}>
            {children}
        </span>
    </>)
}