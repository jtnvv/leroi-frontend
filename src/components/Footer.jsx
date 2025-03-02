import PropTypes from 'prop-types';
import '../styles/footer.css';
import { FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";

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
      socialMedia: "Redes sociales",
      infoentLink: "/legal",
      aboutUsLink: "/about",
      faqLink: "/#faq",
      tutorialsLink: "/tutorials",
      termsLink: "/terms",
      privacyLink: "/privacy",
      instagram: <FaInstagram />,
      instagramLink: "https://www.instagram.com/leroidevteam/",
      x: <FaTwitter />,
      xLink: "https://x.com/LeroiDevteam",
      discord: <FaDiscord />,
      discordLink: "https://discord.gg/Yuw2Qec9xY",
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
      socialMedia: PropTypes.string,
      aboutUsLink: PropTypes.string,
      faqLink: PropTypes.string,
      tutorialsLink: PropTypes.string,
      termsLink: PropTypes.string,
      privacyLink: PropTypes.string,
      instagram: PropTypes.node,
      instagramLink: PropTypes.string,
      x: PropTypes.node,
      xLink: PropTypes.string,
      discord: PropTypes.node,
      discordLink: PropTypes.string,
    }),
  }),
};

function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">

          {/* Sección de Redes Sociales */}
          <div className="footer-section">
            <h4>{t.footer.socialMedia}</h4>
            <ul>
              <li className="social-icons">
                <a 
                  href={t.footer.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t.footer.instagram}
                </a>
                <a 
                  href={t.footer.xLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t.footer.x}
                </a>
                <a 
                  href={t.footer.discordLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t.footer.discord}
                </a>
              </li>
            </ul>
          </div>

          {/* Sección de Información */}
          <div className="footer-section">
            <h4>{t.footer.aboutUs}</h4>
            <ul>
              <li><a href={t.footer.aboutUsLink}>{t.footer.infoent}</a></li>
            </ul>
          </div>
          <h4>© 2025 Leroi. Todos los derechos reservados.</h4>
          {/* Sección de Recursos */}
          <div className="footer-section">
            <h4>{t.footer.resources}</h4>
            <ul>
              <li><a href={t.footer.faqLink}>{t.footer.faq}</a></li>
            </ul>
          </div>

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
