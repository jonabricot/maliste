import LinkInternal from "../Typography/LinkInternal"
import Box from "./Box"
import Container from "./Container"
import Grid from "./Grid"
import Section from "./Section"

export default function LayoutBase({children}) {
    return <Box css={{ minHeight: '100%', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
        <Section type="header"> </Section>
        <Section type="main" css={{ padding: '$large 0' }}>
            <Container>
                {children}
            </Container>
        </Section>
        <Section type="footer" css={{ padding: '$medium 0' }}> 
            <Container>
                <Grid fluid>
                    <LinkInternal to={'/'}>Accueil</LinkInternal>
                </Grid>
            </Container>
        </Section>
    </Box>
}