import { styled } from "@/stitches.config"

const StyledInput = styled('input', {
    $$color: '$colors$text',
    backgroundColor: 'transparent',
    color: '$$color',
    border: '1px solid $$color',
    borderRadius: '$normal',
    padding: '.5em .75em'
})

export default function Input({type = "text", label, ...props}) {
    return <div>
        <label>
            <div>{label}</div>
            <StyledInput type={type} {...props} />
        </label>
    </div>
}