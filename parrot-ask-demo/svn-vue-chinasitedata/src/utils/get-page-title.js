import defaultSettings from '@/settings'

const title = defaultSettings.title || '中海油线体管控系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
