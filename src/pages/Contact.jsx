import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SiteRail from '../components/SiteRail'
import ContactForm from '../components/ContactForm'
import ContactCompanion from '../components/ContactCompanion'
import IndexRail from '../components/IndexRail'

const INDEX_ITEMS = [
  { num: '02', label: 'Contact Info' },
  { num: '03', label: 'Get in Touch' },
  { num: '04', label: 'Availability' },
]

const RAIL_SECTIONS = [
  { label: 'The Hero Section', id: 'gt-hero' },
  { label: 'Contact Info', id: 'gt-contact-info' },
  { label: 'Get in Touch', id: 'gt-form' },
  { label: 'Availability', id: 'gt-availability' },
  { label: 'Footer', id: 'site-footer' },
]

export default function Contact() {
  return (
    <>
      <SiteNav />
      <SiteRail sections={RAIL_SECTIONS} />

      <section id="gt-hero" className="page-stub gt-hero">
        <div className="gt-hero__copy">
          <p className="page-stub__eyebrow">04 · GET IN TOUCH</p>
          <h1 className="page-stub__title">Get in Touch</h1>
        </div>
        <ContactCompanion />
      </section>

      <section id="gt-contact-info" className="contact-info">
        <p className="eyebrow contact-info__eyebrow">Contact Information</p>
        <div className="contact-info__grid">
          <a href="tel:+919284828790" className="contact-info__item" data-cursor>
            <span className="contact-info__label">Phone</span>
            <span className="contact-info__value">+91 92848 28790</span>
          </a>
          <a href="mailto:suhanishahu3008@gmail.com" className="contact-info__item" data-cursor>
            <span className="contact-info__label">Email</span>
            <span className="contact-info__value">suhanishahu3008@gmail.com</span>
          </a>
        </div>
      </section>

      <section id="gt-form" className="gt-section">
        <div className="gt-grid">
          <div className="gt-copy">
            <h2 className="gt-title">Let's Connect</h2>
            <p className="gt-lede">
              I'm currently looking for internship opportunities and would love to connect.
              If you have any opportunity or feedback, feel free to reach out.
            </p>
            <p className="gt-note">
              Feel free to reach out for internship opportunities or any queries — I'd be happy to connect.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <section id="gt-availability" className="availability">
        <p className="eyebrow availability__eyebrow">Availability</p>
        <h2 className="availability__title">Open to internships &amp; collaborations</h2>
        <p className="availability__body">
          Currently available for internships, freelance projects, and design collaborations.
          I typically respond within 24–48 hours.
        </p>
      </section>

      <IndexRail items={INDEX_ITEMS} />
      <SiteFooter />
    </>
  )
}
