import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Color palette for charts
const CHART_COLORS = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(6, 182, 212, 0.8)',
  'rgba(139, 92, 246, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(34, 211, 238, 0.8)',
]

const CHART_BORDERS = [
  'rgba(99, 102, 241, 1)',
  'rgba(6, 182, 212, 1)',
  'rgba(139, 92, 246, 1)',
  'rgba(245, 158, 11, 1)',
  'rgba(239, 68, 68, 1)',
  'rgba(16, 185, 129, 1)',
  'rgba(236, 72, 153, 1)',
  'rgba(34, 211, 238, 1)',
]

export default function ResultsPage({ results, onReset }) {
  const navigate = useNavigate()
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (!results) {
      navigate('/dashboard')
      return
    }
    // Animate score
    const target = results.overallScore
    const duration = 1500
    const start = performance.now()

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
      setAnimatedScore(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [results, navigate])

  const handleReUpload = () => {
    onReset()
    navigate('/dashboard')
  }

  if (!results) return null

  const { overallScore, severity, issues, suggestions, charts, totalResponses, totalFields, biasBreakdown } = results

  // Gauge color
  const gaugeColor = severity === 'high' ? '#ef4444' : severity === 'moderate' ? '#f59e0b' : '#10b981'
  const severityLabel = severity === 'high' ? 'High Bias' : severity === 'moderate' ? 'Moderate Bias' : 'Low Bias'

  // SVG gauge arc
  const radius = 90
  const circumference = Math.PI * radius
  const dashOffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="results-page container" id="results-page">
      {/* Header */}
      <div className="results-header">
        <h1>📋 Bias Analysis Report</h1>
        <p>
          Analyzed {totalResponses} responses across {totalFields} fields
        </p>
      </div>

      {/* Gauge */}
      <div className="gauge-section">
        <div className="gauge-card glass-card">
          <div className="gauge-container">
            <svg className="gauge-svg" viewBox="0 0 220 130">
              <path
                className="gauge-bg"
                d="M 20 110 A 90 90 0 0 1 200 110"
              />
              <path
                className="gauge-fill"
                d="M 20 110 A 90 90 0 0 1 200 110"
                stroke={gaugeColor}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
          </div>
          <div className="gauge-score" style={{ color: gaugeColor }}>
            {animatedScore}%
          </div>
          <div className="gauge-label">Overall Bias Score</div>
          <div className={`gauge-status ${severity}`}>
            {severity === 'high' ? '⚠️' : severity === 'moderate' ? '⚡' : '✅'} {severityLabel}
          </div>
        </div>
      </div>

      {/* Bias Breakdown Cards */}
      <div className="results-grid">
        <BiasCard
          icon="👥"
          title="Demographic Bias"
          score={biasBreakdown.demographic}
          color="rgba(99, 102, 241, 0.15)"
        />
        <BiasCard
          icon="🕐"
          title="Temporal Bias"
          score={biasBreakdown.temporal}
          color="rgba(6, 182, 212, 0.15)"
        />
        <BiasCard
          icon="📊"
          title="Sampling Bias"
          score={biasBreakdown.sampling}
          color="rgba(139, 92, 246, 0.15)"
        />
        <BiasCard
          icon="💬"
          title="Question Bias"
          score={biasBreakdown.question}
          color="rgba(245, 158, 11, 0.15)"
        />
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="issues-section">
          <h2>⚠️ Detected Issues ({issues.length})</h2>
          {issues.map((issue, i) => (
            <div className="issue-item" key={i}>
              <span className={`issue-badge ${issue.severity}`}>{issue.severity}</span>
              <span className="issue-text">
                <strong>{issue.type}:</strong> {issue.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="suggestions-section">
          <h2>💡 Recommendations</h2>
          {suggestions.map((suggestion, i) => (
            <div className="suggestion-item" key={i}>
              <span className="suggestion-icon">→</span>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {(charts.gender || charts.demographic || charts.time || charts.age) && (
        <div className="charts-section">
          <div className="charts-grid">
            {(charts.gender || charts.demographic) && (
              <div className="chart-card glass-card">
                <h3>📊 {charts.gender ? 'Gender' : charts.demographic?.field || 'Response'} Distribution</h3>
                <div className="chart-wrapper">
                  <PieChart data={charts.gender || charts.demographic} />
                </div>
              </div>
            )}

            {charts.time && (
              <div className="chart-card glass-card">
                <h3>📅 Response Time Distribution</h3>
                <div className="chart-wrapper">
                  <BarChart data={charts.time} />
                </div>
              </div>
            )}

            {charts.age && (
              <div className="chart-card glass-card">
                <h3>👤 Age Distribution</h3>
                <div className="chart-wrapper">
                  <PieChart data={charts.age} />
                </div>
              </div>
            )}

            {/* Bias breakdown bar chart */}
            <div className="chart-card glass-card">
              <h3>🎯 Bias Score Breakdown</h3>
              <div className="chart-wrapper">
                <BarChart
                  data={{
                    labels: ['Demographic', 'Temporal', 'Sampling', 'Question'],
                    values: [
                      biasBreakdown.demographic,
                      biasBreakdown.temporal,
                      biasBreakdown.sampling,
                      biasBreakdown.question,
                    ],
                  }}
                  isBreakdown
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="results-actions">
        <button className="btn btn-primary" onClick={handleReUpload} id="reupload-btn">
          📁 Analyze Another File
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => window.print()}
          id="export-btn"
        >
          🖨️ Export Report
        </button>
      </div>
    </div>
  )
}

// ===== Sub-Components =====

function BiasCard({ icon, title, score, color }) {
  const getSeverity = (s) => {
    if (s >= 60) return { label: 'High', color: 'var(--danger)' }
    if (s >= 35) return { label: 'Moderate', color: 'var(--warning)' }
    return { label: 'Low', color: 'var(--success)' }
  }

  const sev = getSeverity(score)

  return (
    <div className="result-card glass-card">
      <div className="result-card-header">
        <div className="card-icon" style={{ background: color }}>{icon}</div>
        <h3>{title}</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          flex: 1,
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(148, 163, 184, 0.1)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${score}%`,
            borderRadius: '4px',
            background: sev.color,
            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: sev.color, minWidth: '50px', textAlign: 'right' }}>
          {score}%
        </span>
      </div>
      <div style={{ marginTop: '8px', fontSize: '0.8rem', color: sev.color, fontWeight: 600 }}>
        {sev.label} Risk
      </div>
    </div>
  )
}

function PieChart({ data }) {
  if (!data) return null

  const chartData = useMemo(() => ({
    labels: data.labels,
    datasets: [{
      data: data.values,
      backgroundColor: CHART_COLORS.slice(0, data.labels.length),
      borderColor: CHART_BORDERS.slice(0, data.labels.length),
      borderWidth: 2,
    }],
  }), [data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 16,
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: 600 },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`
          },
        },
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

function BarChart({ data, isBreakdown }) {
  if (!data) return null

  const getBarColors = () => {
    if (isBreakdown) {
      return data.values.map(v =>
        v >= 60 ? 'rgba(239, 68, 68, 0.8)' :
        v >= 35 ? 'rgba(245, 158, 11, 0.8)' :
        'rgba(16, 185, 129, 0.8)'
      )
    }
    return CHART_COLORS.slice(0, data.labels.length)
  }

  const chartData = useMemo(() => ({
    labels: data.labels,
    datasets: [{
      data: data.values,
      backgroundColor: getBarColors(),
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 6,
      borderSkipped: false,
    }],
  }), [data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: 600 },
        bodyFont: { family: 'Inter' },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
          maxRotation: 45,
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.08)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
