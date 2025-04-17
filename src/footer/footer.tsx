import { useTranslation } from 'react-i18next';
import '../footer/footer.css'

const Footer = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer  >
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('de')}>Deutsch</button>
      <button onClick={() => changeLanguage('al')}>Albanian</button>
    </footer>
  );
};

export default Footer;
