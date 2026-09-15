import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SiteRail from '../components/SiteRail'

export default function WorkIndex() {
  return (
    <>
      <SiteNav />
      <SiteRail />
      <div id="wi-top" className="page-footer-anchor">
        <SiteFooter />
      </div>
    </>
  )
}
