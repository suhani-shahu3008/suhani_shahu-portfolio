import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SiteRail from '../components/SiteRail'
import ContactForm from '../components/ContactForm'
import Button from '../components/Button'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="12" height="12" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const PROJECTS = [
  {
    id: 'cs-01',
    num: '01',
    slug: 'speedline-couriers-logistics-dashboard',
    title: 'SpeedLine Couriers Logistics Dashboard',
    desc: 'Speedline Couriers is a route planner-based logistics dashboard designed to help manage and optimize delivery operations. The goal of this project was to simplify route planning, improve efficiency, and present complex logistics data in a clear and easy-to-use way.',
    tags: ['Dashboard', 'Logistics', 'Product Design'],
    image: '/case-studies/logistics-dashboard.png',
    layout: 'split',
  },
  {
    id: 'cs-02',
    num: '02',
    slug: 'vr-mall-navigator',
    title: 'VR Mall Navigator',
    desc: 'A smart indoor navigation and parking assistance mobile app for VR Mall that helps users easily locate stores, facilities, and parking spots using interactive 2D maps, AR-based directions, and a real-time parking reservation system. The project focused on improving wayfinding, reducing navigation confusion, and enhancing the overall mall experience through a seamless, user-friendly interface and integrated navigation ecosystem.',
    tags: ['XR / Spatial', 'Navigation', 'Retail'],
    image: '/case-studies/vr-mall-navigator.png',
    layout: 'split-reverse',
  },
  {
    id: 'cs-03',
    num: '03',
    slug: 'netflix-vr-menu',
    title: 'Netflix VR Menu',
    desc: 'Designed a virtual reality Netflix menu interface to explore immersive content browsing and interaction within a VR environment. Focused on user experience, spatial navigation, visual hierarchy, and interactive UI elements to create an engaging and futuristic entertainment platform.',
    tags: ['XR / Spatial', 'Entertainment', 'Interaction Design'],
    image: '/case-studies/netflix-vr-menu-interface.png',
    layout: 'split',
  },
  {
    id: 'cs-04',
    num: '04',
    slug: 'smart-home-control-dashboard',
    title: 'Smart Home Control Dashboard',
    desc: 'A smart home control dashboard designed to simplify the management of home devices through a centralized and intuitive interface. The project focuses on creating a clean, modern UI that allows users to monitor, control, and automate smart home functions efficiently.',
    tags: ['Dashboard', 'IoT', 'Product Design'],
    image: '/case-studies/smart-home-control-dashboard.png',
    layout: 'split-reverse',
  },
]

const RAIL_SECTIONS = [
  { label: 'The Hero Section', id: 'cs-header' },
  { label: PROJECTS[0].title, id: PROJECTS[0].id },
  { label: PROJECTS[1].title, id: PROJECTS[1].id },
  { label: PROJECTS[2].title, id: PROJECTS[2].id },
  { label: PROJECTS[3].title, id: PROJECTS[3].id },
  { label: 'Get in Touch', id: 'cs-contact' },
  { label: 'The Footer', id: 'site-footer' },
]

function CaseMeta({ num, label = 'Case Study' }) {
  return (
    <div className="cs-meta-row">
      <span className="dot" />
      <span className="k">{label} - <b>{num}</b></span>
      <span className="rule" />
    </div>
  )
}

function ProjectCTA({ slug }) {
  return (
    <Button as="a" href={`/case-studies/${slug}`} variant="primary" size="md" iconTrailing={<ArrowIcon />}>
      View Case Study
    </Button>
  )
}

function ProjectTags({ tags }) {
  return (
    <div className="cs-tags">
      {tags.map((t) => <span className="cs-tag" key={t}>{t}</span>)}
    </div>
  )
}

function SplitProject({ project }) {
  const info = (
    <div className="cs-info" key="info">
      <h2 className="cs-info__title">{project.title}</h2>
      <p className="cs-info__desc">{project.desc}</p>
      <ProjectTags tags={project.tags} />
      <div className="cs-info__cta"><ProjectCTA slug={project.slug} /></div>
    </div>
  )
  const media = (
    <div className="cs-media" key="media">
      <img src={project.image} alt={project.title} loading="lazy" />
    </div>
  )

  return (
    <section id={project.id} className="cs-section">
      <CaseMeta num={project.num} />
      <div className="cs-card cs-card--split">
        {project.layout === 'split-reverse' ? [info, media] : [media, info]}
      </div>
    </section>
  )
}

export default function WorkIndex() {
  return (
    <>
      <SiteNav />
      <SiteRail sections={RAIL_SECTIONS} />

      <header id="cs-header" className="cs-header">
        <h1 className="cs-header__title">Case Studies</h1>
        <p className="cs-header__lede">A closer look at four projects — how each one was framed, designed, and shipped.</p>
      </header>

      <div className="cs-list">
        {PROJECTS.map((project) => <SplitProject project={project} key={project.id} />)}
      </div>

      <section id="cs-contact" className="gt-section">
        <CaseMeta num="05" label="Get in Touch" />
        <div className="gt-grid">
          <div className="gt-copy">
            <h2 className="gt-title">Let's Connect</h2>
            <p className="gt-lede">
              Liked what you saw? I'm currently looking for internship opportunities and would love to connect.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
