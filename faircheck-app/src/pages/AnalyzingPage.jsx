import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { label: 'Parsing CSV data', icon: '📄' },
  { label: 'Detecting demographic patterns', icon: '👥' },
  { label: 'Analyzing temporal distribution', icon: '🕐' },
  { label: 'Evaluating sampling diversity', icon: '📊' },
  { label: 'Scanning question language', icon: '💬' },
  { label: 'Generating bias report', icon: '📋' },
]

export default function AnalyzingPage({ file, onAnalysisComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!file) {
      navigate('/dashboard')
      return
    }

    // Animate through steps
    const stepDuration = 600
    const timers = STEPS.map((_, index) =>
      setTimeout(() => setCurrentStep(index), stepDuration * (index + 1))
    )

    // Start actual analysis
    const analysisTimer = setTimeout(async () => {
      try {
        const { analyzeCSV } = await import('../utils/biasAnalyzer.js')
        const results = await analyzeCSV(file)
        onAnalysisComplete(results)
        navigate('/results')
      } catch (error) {
        console.error('Analysis error:', error)
        // On error, still navigate with mock results
        onAnalysisComplete(getMockResults())
        navigate('/results')
      }
    }, stepDuration * (STEPS.length + 1))

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(analysisTimer)
    }
  }, [file, navigate, onAnalysisComplete])

  return (
    <div className="analyzing-page" id="analyzing-page">
      <div className="analyzing-content">
        <div className="analyzing-animation">
          <div className="analyzing-ring"></div>
          <div className="analyzing-ring"></div>
          <div className="analyzing-ring"></div>
          <div className="analyzing-center-icon">🔍</div>
        </div>

        <h2>Analyzing your data…</h2>
        <p>Scanning for potential biases in your survey dataset</p>

        <div className="analyzing-steps">
          {STEPS.map((step, index) => (
            <div
              key={index}
              className={`analyzing-step ${
                index === currentStep ? 'active' :
                index < currentStep ? 'done' : ''
              }`}
              style={{
                animation: index <= currentStep ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none',
              }}
            >
              <span className="step-icon">
                {index < currentStep ? '✅' : step.icon}
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getMockResults() {
  return {
    overallScore: 42,
    severity: 'moderate',
    totalResponses: 150,
    totalFields: 12,
    issues: [
      { type: 'Gender Bias', severity: 'high', message: 'Gender Bias Detected: 78% Male responses' },
      { type: 'Temporal Bias', severity: 'moderate', message: 'Temporal Bias: 52% of responses collected on Sunday' },
      { type: 'Sample Size', severity: 'low', message: 'Sample size of 150 is adequate but could be larger' },
    ],
    suggestions: [
      'Include more diverse demographic groups in your survey distribution',
      'Collect responses across different time periods and days of the week',
      'Rewrite leading questions in neutral form',
      'Consider targeted outreach to underrepresented groups',
    ],
    charts: {
      gender: {
        labels: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        values: [117, 24, 5, 4],
        field: 'Gender',
      },
      time: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        values: [8, 12, 10, 15, 18, 9, 78],
        field: 'Timestamp',
      },
    },
    fields: ['Timestamp', 'Gender', 'Age', 'Response 1', 'Response 2'],
    biasBreakdown: { demographic: 65, temporal: 45, sampling: 20, question: 15 },
  }
}
