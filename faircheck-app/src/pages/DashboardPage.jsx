import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage({ onFileSelect }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelect(selectedFile)
      navigate('/analyzing')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="dashboard container" id="dashboard-page">
      <div className="dashboard-header">
        <h1>
          Survey <span className="gradient-text">Bias Auditor</span>
        </h1>
        <p>
          Upload your survey data to detect hidden biases before it's used in AI systems.
          Our analysis covers demographic, temporal, sampling and question biases.
        </p>
      </div>

      <div className="upload-section glass-card" style={{ padding: '32px' }}>
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          id="upload-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
          />
          <div className="upload-icon">📁</div>
          <h3>Drop your CSV file here</h3>
          <p>
            or <span className="browse-link">browse</span> to choose a file
          </p>
          <p className="file-types">Supports CSV files from Google Forms, Typeform, SurveyMonkey, and more</p>
        </div>

        {selectedFile && (
          <div className="file-selected" id="file-selected">
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div>
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              </div>
            </div>
            <button
              className="btn-remove"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              id="remove-file-btn"
            >
              ✕
            </button>
          </div>
        )}

        {selectedFile && (
          <div className="analyze-btn-container">
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              id="analyze-btn"
              style={{ padding: '14px 40px', fontSize: '1.05rem' }}
            >
              🔍 Analyze for Bias
            </button>
          </div>
        )}
      </div>

      <div className="info-grid">
        <div className="info-card glass-card">
          <div className="card-icon demographic">👥</div>
          <h3>Demographic Bias</h3>
          <p>Detects gender, age, and ethnic imbalances in your survey responses</p>
        </div>
        <div className="info-card glass-card">
          <div className="card-icon temporal">🕐</div>
          <h3>Temporal Bias</h3>
          <p>Identifies if responses are concentrated on specific days or times</p>
        </div>
        <div className="info-card glass-card">
          <div className="card-icon sampling">📊</div>
          <h3>Sampling & Question Bias</h3>
          <p>Checks sample diversity and detects leading or loaded questions</p>
        </div>
      </div>
    </div>
  )
}
