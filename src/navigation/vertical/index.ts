import appsAndPages from './apps-and-pages'
import charts from './charts'
import dashboard from './dashboard'
import forms from './forms'
import others from './others'
import uiElements from './ui-elements'
import campaigns from './campaigns'
import type { VerticalNavItems } from '@layouts/types'

export default [...dashboard, ...appsAndPages, ...uiElements, ...forms, ...charts, ...others, ...campaigns] as VerticalNavItems
//export default [ ...campaigns] as VerticalNavItems
