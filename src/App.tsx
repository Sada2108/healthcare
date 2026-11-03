import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Centres from './pages/Centres'
import Check from './pages/Check'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Login from './pages/Login'
import Referral from './pages/Referral'
import Result from './pages/Result'
import ChwHome from './pages/chw/ChwHome'
import ChwAddWoman from './pages/chw/ChwAddWoman'
import ChwWomanDetail from './pages/chw/ChwWomanDetail'
import { CHWProvider } from './logic/chwStore'
import { AuthProvider } from './logic/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastProvider } from './components/Toast'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <CHWProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <Learn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/check"
                element={
                  <ProtectedRoute>
                    <Check />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/result"
                element={
                  <ProtectedRoute>
                    <Result />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/centres"
                element={
                  <ProtectedRoute>
                    <Centres />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/referral"
                element={
                  <ProtectedRoute>
                    <Referral />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chw"
                element={
                  <ProtectedRoute>
                    <ChwHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chw/add"
                element={
                  <ProtectedRoute>
                    <ChwAddWoman />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chw/woman/:id"
                element={
                  <ProtectedRoute>
                    <ChwWomanDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </CHWProvider>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  )
}
