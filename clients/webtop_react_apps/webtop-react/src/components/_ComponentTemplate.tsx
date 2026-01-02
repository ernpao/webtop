
interface CustomComponentProps {
    className?: string
}

const CustomComponent: React.FC<CustomComponentProps> = ({ className = '' }: CustomComponentProps) => {

    const finalClassName = `custom-component ${className}`

    return <>


    </>
}

export default CustomComponent;