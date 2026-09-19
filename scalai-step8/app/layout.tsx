import "./globals.css"; import type { Metadata } from "next";
export const metadata:Metadata={title:"ScalAI — Tous vos agents IA. Un seul espace de travail.",description:"Réunissez vos agents IA dans un seul espace de travail."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}