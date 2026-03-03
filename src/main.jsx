import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router/Routes'
import { RouterProvider } from 'react-router-dom'
import { I18nProvider } from './i18n/I18nProvider'

createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <RouterProvider router={router} />
  </I18nProvider>
)
