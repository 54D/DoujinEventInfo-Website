import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import 'react-virtualized/styles.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)
