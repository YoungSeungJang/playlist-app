import Layout from './components/layout/Layout'
import AppRoutes from './routes'
import LoginModal from './components/auth/LoginModal'
import RegisterModal from './components/auth/RegisterModal'

function App() {
  return (
    <Layout>
      <AppRoutes />
      <LoginModal />
      <RegisterModal />
    </Layout>
  )
}

export default App