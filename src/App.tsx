import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Centres from './pages/Centres'
import Check from './pages/Check'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Referral from './pages/Referral'
import Result from './pages/Result'
import ChwHome from './pages/chw/ChwHome'
import ChwAddWoman from './pages/chw/ChwAddWoman'
import ChwWomanDetail from './pages/chw/ChwWomanDetail'
import { CHWProvider } from './logic/chwStore'
import { ToastProvider } from './components/Toast'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <CHWProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/check" element={<Check />} />
            <Route path="/result" element={<Result />} />
            <Route path="/centres" element={<Centres />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/chw" element={<ChwHome />} />
            <Route path="/chw/add" element={<ChwAddWoman />} />
            <Route path="/chw/woman/:id" element={<ChwWomanDetail />} />
          </Routes>
        </CHWProvider>
      </BrowserRouter>
    </ToastProvider>
  )
}
