import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atatürk ile Röportaj',
  description: 'Kurtuluş Savaşı dönemi hakkında Mustafa Kemal Atatürk ile birinci şahıs tarih röportajı ve eğitim chatbotu.',
  openGraph: {
    title: 'Atatürk ile Röportaj',
    description: 'Kurtuluş Savaşı dönemi hakkında Mustafa Kemal Atatürk ile birinci şahıs tarih röportajı ve eğitim chatbotu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atatürk ile Röportaj',
    description: 'Kurtuluş Savaşı dönemi hakkında Mustafa Kemal Atatürk ile birinci şahıs tarih röportajı ve eğitim chatbotu.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="font-sans antialiased bg-stone-900 text-stone-100">
        {children}
      </body>
    </html>
  );
}

