import LoginModal from './components/auth/LoginModal'
import RegisterModal from './components/auth/RegisterModal'
import Layout from './components/layout/Layout'
import AuthInitailizer from './components/providers/AuthInitializer'
import AppRoutes from './routes'

function App() {
  return (
    <AuthInitailizer>
      <Layout>
        <AppRoutes />
        <LoginModal />
        <RegisterModal />
      </Layout>
    </AuthInitailizer>
  )
}

export default App
