
import { Html,Head,Font,Preview,Heading,Row,Section,Text,Button } from "@react-email/components";

interface VerificationEmailProps{
    username:string;
    otp:string;
}

export default function VerificationEmail({username,otp}:VerificationEmailProps){
    return(
        <Html lang="en" dir="ltr" >
            <Head>
                <title>Verification Code</title>
                <Font 
                    fontFamily="Roboto" 
                    fallbackFontFamily="Verdana" 
                    fontWeight={400}
                    fontStyle="normal"
                />    
            </Head>
            <Preview>
                Here's your verficaion code: {otp}
            </Preview>
            <Section>
                <Row>
                    <Heading as='h2'> Hello {username}</Heading>
                </Row>
                <Row>
                    <Text>
                        Thankyou for registering. Please use following verificationcode to complete your registration:
                    </Text>
                </Row>
                <Row>
                    <Text>
                        {otp}
                    </Text>
                </Row>

            </Section>

        </Html>
    )
}