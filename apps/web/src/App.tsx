import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Playlist
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                협업 플레이리스트 관리 앱
              </h2>
              <p className="text-gray-600">
                친구들과 함께 플레이리스트를 만들고 관리해보세요!
              </p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App