import localFont from "next/font/local";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import { IdentityKitAuthType } from "@nfid/identitykit";

import "@nfid/identitykit/react/styles.css";
import "./globals.css";

// Font configurations
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata configuration
export const metadata = {
  title: "Bitchanga",
  description: "Decentralized Crowdfunding Platform",
};

// Root layout component
export default function RootLayout({ children }) {

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen">
        <IdentityKitProvider
          authType={IdentityKitAuthType.DELEGATION}
          signerClientOptions={{
            targets: ["vwyrn-laaaa-aaaah-qpwnq-cai"]
          }}

        >
          {children}
        </IdentityKitProvider>
      </body>
    </html>
  );
}