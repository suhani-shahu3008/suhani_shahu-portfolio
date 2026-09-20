import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SiteRail from '../components/SiteRail'
import IndexRail from '../components/IndexRail'
import GrainField from '../components/GrainField'

const INDEX_ITEMS = [
  { num: '02', label: 'Case Study 1' },
  { num: '03', label: 'Case Study 2' },
  { num: '04', label: 'Case Study 3' },
  { num: '05', label: 'Case Study 4' },
  { num: '06', label: 'Get in Touch' },
]

const RAIL_SECTIONS = [
  { label: 'Case Study 1' },
  { label: 'Case Study 2' },
  { label: 'Case Study 3' },
  { label: 'Case Study 4' },
  { label: 'Get in Touch' },
  { label: 'The Footer' },
]

export default function WorkIndex() {
  return (
    <>
      <GrainField />
      <SiteNav />
      <SiteRail sections={RAIL_SECTIONS} />
      <div id="wi-top" className="page-footer-anchor">
        <IndexRail items={INDEX_ITEMS} />
        <SiteFooter />
      </div>
    </>
  )
}
