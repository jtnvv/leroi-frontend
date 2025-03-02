import PropTypes from 'prop-types';
import '../styles/footer.css';

Footer.defaultProps = {
  t: {
    footer: {
      aboutUs: "Sobre nosotros",
      resources: "Recursos",
      legal: "Legal",
      faq: "FAQ",
      tutorials: "Tutoriales",
      terms: "Términos y condiciones",
      privacy: "Privacidad",
      infoent: "Información de la empresa",
      infoentLink: "/legal",
      aboutUsLink: "/about",
      faqLink: "/faq",
      tutorialsLink: "/tutorials",
      termsLink: "/terms",
      privacyLink: "/privacy",
    },
  },
};

Footer.propTypes = {
  t: PropTypes.shape({
    footer: PropTypes.shape({
      aboutUs: PropTypes.string,
      resources: PropTypes.string,
      legal: PropTypes.string,
      faq: PropTypes.string,
      tutorials: PropTypes.string,
      terms: PropTypes.string,
      privacy: PropTypes.string,
      infoent: PropTypes.string,
      aboutUsLink: PropTypes.string,
      faqLink: PropTypes.string,
      tutorialsLink: PropTypes.string,
      termsLink: PropTypes.string,
      privacyLink: PropTypes.string,
    }),
  }),
};

function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          {/* Sección de Información */}
          <div className="footer-section">
            <h4>{t.footer.aboutUs}</h4>
            <ul>
              <li><a href={t.footer.aboutUsLink}>{t.footer.infoent}</a></li>
            </ul>
          </div>
          <h4>© 2025 Leroi. Todos los derechos reservados.</h4>
          {/* Sección de Recursos */}
          {/* <div className="footer-section">
            <h4>{t.footer.resources}</h4>
            <ul>
              <li><a href={t.footer.faqLink}>{t.footer.faq}</a></li>
              <li><a href={t.footer.tutorialsLink}>{t.footer.tutorials}</a></li>
            </ul>
          </div> */}

          {/* Sección Legal */}
          {/* <div className="footer-section">
            <h4>{t.footer.legal}</h4>
            <ul>
              <li><a href={t.footer.termsLink}>{t.footer.terms}</a></li>
              <li><a href={t.footer.privacyLink}>{t.footer.privacy}</a></li>
            </ul>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
