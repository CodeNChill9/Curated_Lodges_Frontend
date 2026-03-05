"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      header: {
        experience: 'Experience',
        basecamps: 'Basecamps',
        fieldNotes: 'Field Notes',
        signIn: 'Sign In',
      },
      footer: {
        tagline: 'Discover extraordinary wildlife lodges around the world',
        navigation: 'Navigation',
        basecamps: 'Basecamps',
        expeditions: 'Expeditions',
        fieldNotes: 'Field Notes',
        contactUs: 'Contact Us',
        stayWild: 'Stay Wild',
        newsletterDesc: 'Subscribe to our newsletter for updates',
        enterEmail: 'Enter your email',
        subscribe: 'Subscribe',
        copyright: 'All rights reserved.',
        disclaimer: 'Disclaimer',
        privacyPolicy: 'Privacy Policy',
        refundPolicy: 'Refund Policy',
        termsConditions: 'Terms & Conditions',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
