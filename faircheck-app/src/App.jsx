import { useState, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalyzingPage from './pages/AnalyzingPage'
import ResultsPage from './pages/ResultsPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/" replace />
}

export default function App() {
  const { isAuthenticated } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file)
    setAnalysisResults(null)
  }, [])

  const handleAnalysisComplete = useCallback((results) => {
    setAnalysisResults(results)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setAnalysisResults(null)
  }, [])

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage onFileSelect={handleFileSelect} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyzing"
          element={
            <ProtectedRoute>
              <AnalyzingPage
                file={selectedFile}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage results={analysisResults} onReset={handleReset} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
