import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ui.byronwade.com",
    template: "%s · ui.byronwade.com",
  },
  description: "Design system and UI for Byron Wade.",
  metadataBase: new URL("https://ui.byronwade.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
