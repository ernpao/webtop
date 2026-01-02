export default function TextBanner({ children }: { children: React.ReactNode }) {
    return (<>
        <h1 className="text-banner">
            {children}
        </h1>
    </>)
}