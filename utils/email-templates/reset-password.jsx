"use server";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Text,
  Preview,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

export const resetLinkEmail = async (token_hash, next) => {
  const reset_link = `${process.env.BASE_URL}/reset/api?token_hash=${token_hash}&type=recovery&next=${next}/reset`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>STM Golf Dashboard Password Reset</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            <Row style={imageSection}>
              <Column align="center">
                <Img
                  src={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/email-header.png`}
                  width="75"
                  height="45"
                  alt="STM Golf Logo"
                />
              </Column>
            </Row>
            <Section style={upperSection}>
              <Heading style={h1}>Password Reset</Heading>
              <Text style={mainText}>
                If you&apos;ve lost your password or wish to reset it,
                <br />
                use the link below to get started.
              </Text>
              <Row style={resetButtonSection}>
                <Column align="center">
                  <Button style={button} href={reset_link}>
                    Reset Password
                  </Button>
                  <Text style={validityText}>
                    (This code is valid for 1 hour)
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                If you did not request a password reset, you can safely ignore
                this email. Only a person with access to your email can reset
                your account password.
              </Text>
            </Section>
          </Section>
          <Text style={footerText}>©2025 Justin Monsees</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default resetLinkEmail;

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const h1 = {
  color: "#333",
  fontFamily:
    "'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "30px",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "15px",
};

const button = {
  fontSize: "14px",
  backgroundColor: "#560505",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};

const text = {
  color: "#333",
  fontFamily:
    "'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
  textAlign: "center",
};

const imageSection = {
  backgroundColor: "#560505",

  padding: "20px 5px",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const validityText = {
  ...text,
  margin: "15px 0 0 0",
  textAlign: "center",
};

const resetButtonSection = {};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };
