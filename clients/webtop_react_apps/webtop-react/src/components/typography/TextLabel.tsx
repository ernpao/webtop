export default function TextLabel({ children }: { children?: React.ReactNode }) {
    return (<>
        <span className="text-label">
            {children}
        </span>
    </>)
}