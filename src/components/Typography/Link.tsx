import Button from "@/components/Ui/Button";

export default function Link({theme = 'link', padding = 'none', children, ...props}) {
    return <Button as="a" theme={theme} padding={padding} {...props}>{children}</Button>
}