import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SiteRail from '../components/SiteRail'
import ContactCompanion from '../components/ContactCompanion'
import GrainField from '../components/GrainField'

const RAIL_SECTIONS = [
  { label: 'The Hero Section', id: 'gt-hero' },
  { label: 'Footer', id: 'site-footer' },
]

export default function Contact() {
  return (
    <>
      <GrainField />
      <SiteNav />
      <SiteRail sections={RAIL_SECTIONS} />

      <section id="gt-hero" className="page-stub gt-hero">
        <div className="gt-hero__copy">
          <p className="page-stub__eyebrow">04 · GET IN TOUCH</p>
          <h1 className="page-stub__title">Get in Touch</h1>
        </div>
        <ContactCompanion />
      </section>

      <SiteFooter />
    </>
  )
}
