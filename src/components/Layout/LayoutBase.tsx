import Container from "./Container"
import Section from "./Section"

export default function LayoutBase({children}) {
    return <div>
        <Section type="header"> </Section>
        <Section type="main" css={{ padding: '$large 0' }}>
            <Container>
                {children}
            </Container>
        </Section>
        <Section type="footer"> </Section>
    </div>
}