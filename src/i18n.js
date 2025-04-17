import i18n from 'i18next'
import { initReactI18next } from 'react-i18next';
import en from '../src/translations/en.json';
import de from '../src/translations/de.json';
import al from '../src/translations/al.json';

i18n
    .use(initReactI18next)
    .init({
        resources:{
            en:{ translation: en },
            de:{ translation: de },
            al:{ translation: al },
        },
        lng: 'en',
        fallbackLng: 'en',

        interpolation: {
            
        }
    })

    export default i18n;