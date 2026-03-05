"use client";

import { ReduxProvider } from '@/store/ReduxProvider';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Curated Lodges - Discover Extraordinary Wildlife Lodges</title>
        <meta name="description" content="Discover extraordinary wildlife lodges around the world" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/assests/images/Curated_Lodges_Logo.png" />
      </head>
      <body>
        <ReduxProvider>
          <I18nextProvider i18n={i18n}>
            <LocalizationProvider>
              {children}
            </LocalizationProvider>
          </I18nextProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
