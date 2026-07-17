import {defineConfig, buildLegacyTheme} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, defaultDocumentNode} from './structure'
import {KiaLogo, KiaIcon} from './components/StudioBranding'

// Màu thương hiệu Kia (navy đậm #05141F) áp cho nút/trạng thái focus/active
// trong Studio thay vì xanh mặc định của Sanity -- xem STUDIO_CUSTOMIZATION.md
// để biết chi tiết các tuỳ chỉnh giao diện Studio đã thực hiện.
const kiaTheme = buildLegacyTheme({
  '--black': '#05141F',
  '--white': '#ffffff',

  '--gray': '#636D74',
  '--gray-base': '#788187',

  '--component-bg': '#ffffff',
  '--component-text-color': '#05141F',

  '--brand-primary': '#05141F',

  '--default-button-color': '#05141F',
  '--default-button-primary-color': '#05141F',
  '--default-button-success-color': '#2CB25E',
  '--default-button-warning-color': '#E8A400',
  '--default-button-danger-color': '#D6362E',

  '--state-info-color': '#2276FC',
  '--state-success-color': '#2CB25E',
  '--state-warning-color': '#E8A400',
  '--state-danger-color': '#D6362E',

  '--main-navigation-color': '#05141F',
  '--main-navigation-color--inverted': '#ffffff',

  '--focus-color': '#05141F',
})

export default defineConfig({
  name: 'default',
  title: 'OMBC — Kia FIFA World Cup 2026',
  icon: KiaIcon,

  projectId: '4k3v8aiu',
  dataset: 'production',

  plugins: [structureTool({structure, defaultDocumentNode}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      logo: KiaLogo,
    },
  },

  theme: kiaTheme,
})
