import Papa from 'papaparse'

/**
 * Main bias analysis engine.
 * Parses a CSV file and detects various types of bias.
 */
export function analyzeCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const analysis = runAnalysis(results.data, results.meta.fields)
          resolve(analysis)
        } catch (err) {
          reject(err)
        }
      },
      error: (err) => reject(err),
    })
  })
}

function runAnalysis(data, fields) {
  const totalResponses = data.length
  const issues = []
  const suggestions = []
  const charts = {}
  let biasScores = []

  // 1. Demographic Bias Detection
  const demographicResult = detectDemographicBias(data, fields)
  if (demographicResult) {
    biasScores.push(demographicResult.score)
    issues.push(...demographicResult.issues)
    suggestions.push(...demographicResult.suggestions)
    if (demographicResult.charts) {
      Object.assign(charts, demographicResult.charts)
    }
  }

  // 2. Temporal Bias Detection
  const temporalResult = detectTemporalBias(data, fields)
  if (temporalResult) {
    biasScores.push(temporalResult.score)
    issues.push(...temporalResult.issues)
    suggestions.push(...temporalResult.suggestions)
    if (temporalResult.charts) {
      Object.assign(charts, temporalResult.charts)
    }
  }

  // 3. Sampling Bias Detection
  const samplingResult = detectSamplingBias(data, fields, totalResponses)
  if (samplingResult) {
    biasScores.push(samplingResult.score)
    issues.push(...samplingResult.issues)
    suggestions.push(...samplingResult.suggestions)
  }

  // 4. Question Bias Detection
  const questionResult = detectQuestionBias(fields)
  if (questionResult) {
    biasScores.push(questionResult.score)
    issues.push(...questionResult.issues)
    suggestions.push(...questionResult.suggestions)
  }

  // Calculate overall bias score
  const overallScore = biasScores.length > 0
    ? Math.round(biasScores.reduce((a, b) => a + b, 0) / biasScores.length)
    : 15

  // Determine severity
  let severity = 'low'
  if (overallScore >= 60) severity = 'high'
  else if (overallScore >= 35) severity = 'moderate'

  // Add default suggestions if none found
  if (suggestions.length === 0) {
    suggestions.push('Your dataset appears relatively balanced. Continue monitoring for potential biases.')
  }

  return {
    overallScore,
    severity,
    totalResponses,
    totalFields: fields.length,
    issues,
    suggestions,
    charts,
    fields,
    biasBreakdown: {
      demographic: demographicResult?.score || 0,
      temporal: temporalResult?.score || 0,
      sampling: samplingResult?.score || 0,
      question: questionResult?.score || 0,
    },
  }
}

// ===== Demographic Bias =====
function detectDemographicBias(data, fields) {
  const genderFields = findFieldsByPattern(fields, [
    'gender', 'sex', 'male', 'female', 'm/f', 'man', 'woman'
  ])

  const ageFields = findFieldsByPattern(fields, [
    'age', 'dob', 'date of birth', 'birth', 'year born', 'age group', 'age range'
  ])

  const issues = []
  const suggestions = []
  const charts = {}
  let scores = []

  // Gender analysis
  if (genderFields.length > 0) {
    const genderField = genderFields[0]
    const genderDist = getDistribution(data, genderField)
    charts.gender = {
      labels: Object.keys(genderDist),
      values: Object.values(genderDist),
      field: genderField,
    }

    const total = Object.values(genderDist).reduce((a, b) => a + b, 0)
    const dominantGender = Object.entries(genderDist).sort((a, b) => b[1] - a[1])[0]

    if (dominantGender && total > 0) {
      const ratio = (dominantGender[1] / total) * 100
      if (ratio > 65) {
        const score = Math.min(100, Math.round((ratio - 50) * 2))
        scores.push(score)
        issues.push({
          type: 'Gender Bias',
          severity: ratio > 80 ? 'high' : 'moderate',
          message: `Gender Bias Detected: ${Math.round(ratio)}% ${dominantGender[0]} responses`,
        })
        suggestions.push('Include more diverse demographic groups in your survey distribution')
        suggestions.push('Consider targeted outreach to underrepresented gender groups')
      } else {
        scores.push(10)
      }
    }
  }

  // Age analysis
  if (ageFields.length > 0) {
    const ageField = ageFields[0]
    const ageDist = getDistribution(data, ageField)
    charts.age = {
      labels: Object.keys(ageDist),
      values: Object.values(ageDist),
      field: ageField,
    }

    const total = Object.values(ageDist).reduce((a, b) => a + b, 0)
    const dominantAge = Object.entries(ageDist).sort((a, b) => b[1] - a[1])[0]

    if (dominantAge && total > 0) {
      const ratio = (dominantAge[1] / total) * 100
      if (ratio > 50 && Object.keys(ageDist).length < 4) {
        const score = Math.min(100, Math.round((ratio - 30) * 1.5))
        scores.push(score)
        issues.push({
          type: 'Age Bias',
          severity: ratio > 70 ? 'high' : 'moderate',
          message: `Age Bias Detected: ${Math.round(ratio)}% responses from "${dominantAge[0]}" age group`,
        })
        suggestions.push('Ensure survey reaches respondents across all age demographics')
      } else {
        scores.push(15)
      }
    }
  }

  // General categorical analysis for other demographic fields
  const ethnicityFields = findFieldsByPattern(fields, [
    'race', 'ethnicity', 'ethnic', 'nationality', 'country', 'region', 'location'
  ])

  if (ethnicityFields.length > 0) {
    const field = ethnicityFields[0]
    const dist = getDistribution(data, field)
    const total = Object.values(dist).reduce((a, b) => a + b, 0)
    const dominant = Object.entries(dist).sort((a, b) => b[1] - a[1])[0]

    if (dominant && total > 0) {
      const ratio = (dominant[1] / total) * 100
      if (ratio > 70) {
        scores.push(Math.min(100, Math.round((ratio - 50) * 2)))
        issues.push({
          type: 'Demographic Bias',
          severity: ratio > 80 ? 'high' : 'moderate',
          message: `Limited demographic diversity: ${Math.round(ratio)}% responses from "${dominant[0]}"`,
        })
        suggestions.push('Expand survey distribution to reach more diverse populations')
      }
    }
  }

  if (genderFields.length === 0 && ageFields.length === 0 && ethnicityFields.length === 0) {
    // Try to analyze any categorical columns that might be demographic
    const categoricalFields = fields.filter(f => {
      const dist = getDistribution(data, f)
      const uniqueValues = Object.keys(dist).length
      return uniqueValues >= 2 && uniqueValues <= 10
    })

    if (categoricalFields.length > 0) {
      const field = categoricalFields[0]
      const dist = getDistribution(data, field)
      charts.demographic = {
        labels: Object.keys(dist).slice(0, 8),
        values: Object.values(dist).slice(0, 8),
        field: field,
      }

      const total = Object.values(dist).reduce((a, b) => a + b, 0)
      const dominant = Object.entries(dist).sort((a, b) => b[1] - a[1])[0]
      if (dominant && total > 0) {
        const ratio = (dominant[1] / total) * 100
        if (ratio > 60) {
          scores.push(Math.min(80, Math.round((ratio - 40) * 1.5)))
          issues.push({
            type: 'Response Imbalance',
            severity: ratio > 75 ? 'high' : 'moderate',
            message: `Response imbalance in "${field}": ${Math.round(ratio)}% chose "${dominant[0]}"`,
          })
          suggestions.push(`Consider balancing responses across different options in "${field}"`)
        }
      }
    }
  }

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 10

  return { score: avgScore, issues, suggestions, charts }
}

// ===== Temporal Bias =====
function detectTemporalBias(data, fields) {
  const timestampFields = findFieldsByPattern(fields, [
    'timestamp', 'date', 'time', 'submitted', 'created', 'response time',
    'submission', 'submitted at', 'response date'
  ])

  const issues = []
  const suggestions = []
  const charts = {}

  if (timestampFields.length === 0) {
    return { score: 10, issues: [], suggestions: [], charts: {} }
  }

  const tsField = timestampFields[0]
  const dayDistribution = {}
  const hourDistribution = {}
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  let validDates = 0

  data.forEach(row => {
    const val = row[tsField]
    if (!val) return

    const date = new Date(val)
    if (isNaN(date.getTime())) return

    validDates++
    const day = dayNames[date.getDay()]
    dayDistribution[day] = (dayDistribution[day] || 0) + 1

    const hour = date.getHours()
    const period = hour < 6 ? 'Night (12am-6am)' :
                   hour < 12 ? 'Morning (6am-12pm)' :
                   hour < 18 ? 'Afternoon (12pm-6pm)' :
                   'Evening (6pm-12am)'
    hourDistribution[period] = (hourDistribution[period] || 0) + 1
  })

  if (validDates === 0) {
    return { score: 10, issues: [], suggestions: [], charts: {} }
  }

  // Order by day of week
  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const orderedDayDist = {}
  orderedDays.forEach(day => {
    if (dayDistribution[day]) orderedDayDist[day] = dayDistribution[day]
  })

  charts.time = {
    labels: Object.keys(orderedDayDist).length > 0 ? Object.keys(orderedDayDist) : Object.keys(hourDistribution),
    values: Object.keys(orderedDayDist).length > 0 ? Object.values(orderedDayDist) : Object.values(hourDistribution),
    field: tsField,
  }

  // Check for temporal concentration
  let score = 10
  const dominantDay = Object.entries(dayDistribution).sort((a, b) => b[1] - a[1])[0]
  if (dominantDay) {
    const ratio = (dominantDay[1] / validDates) * 100
    if (ratio > 40) {
      score = Math.min(90, Math.round((ratio - 20) * 1.5))
      issues.push({
        type: 'Temporal Bias',
        severity: ratio > 60 ? 'high' : 'moderate',
        message: `Temporal Bias: ${Math.round(ratio)}% of responses collected on ${dominantDay[0]}`,
      })
      suggestions.push('Collect responses across different time periods and days of the week')
    }
  }

  // Check hour concentration
  const dominantHour = Object.entries(hourDistribution).sort((a, b) => b[1] - a[1])[0]
  if (dominantHour) {
    const ratio = (dominantHour[1] / validDates) * 100
    if (ratio > 60) {
      score = Math.max(score, Math.min(80, Math.round((ratio - 30) * 1.2)))
      issues.push({
        type: 'Time-of-Day Bias',
        severity: 'moderate',
        message: `Time-of-Day Bias: ${Math.round(ratio)}% responses during ${dominantHour[0]}`,
      })
      suggestions.push('Distribute survey collection across different times of day')
    }
  }

  return { score, issues, suggestions, charts }
}

// ===== Sampling Bias =====
function detectSamplingBias(data, fields, totalResponses) {
  const issues = []
  const suggestions = []
  let score = 10

  // Check sample size
  if (totalResponses < 30) {
    score = Math.max(score, 70)
    issues.push({
      type: 'Sample Size',
      severity: totalResponses < 10 ? 'high' : 'moderate',
      message: `Small Sample Size: Only ${totalResponses} responses collected`,
    })
    suggestions.push('Increase sample size to at least 100 responses for more reliable results')
  } else if (totalResponses < 100) {
    score = Math.max(score, 40)
    issues.push({
      type: 'Sample Size',
      severity: 'moderate',
      message: `Limited Sample: ${totalResponses} responses may not be representative`,
    })
    suggestions.push('Consider collecting more responses for statistical significance')
  }

  // Check response uniformity (are responses too similar?)
  const categoricalFields = fields.filter(f => {
    const dist = getDistribution(data, f)
    const uniqueValues = Object.keys(dist).length
    return uniqueValues >= 2 && uniqueValues <= 15
  })

  let lowDiversityCount = 0
  categoricalFields.forEach(field => {
    const dist = getDistribution(data, field)
    const uniqueValues = Object.keys(dist).length
    if (uniqueValues <= 2 && data.length > 20) {
      lowDiversityCount++
    }
  })

  if (lowDiversityCount > categoricalFields.length * 0.5 && categoricalFields.length > 2) {
    score = Math.max(score, 50)
    issues.push({
      type: 'Sampling Bias',
      severity: 'moderate',
      message: `Limited diversity: ${lowDiversityCount} of ${categoricalFields.length} categorical fields have very limited variety`,
    })
    suggestions.push('Ensure survey reaches diverse populations with varied perspectives')
  }

  // Check for missing data
  let missingCount = 0
  data.forEach(row => {
    fields.forEach(f => {
      if (!row[f] || row[f].toString().trim() === '') missingCount++
    })
  })
  const missingPercent = (missingCount / (data.length * fields.length)) * 100

  if (missingPercent > 20) {
    score = Math.max(score, 45)
    issues.push({
      type: 'Data Quality',
      severity: missingPercent > 40 ? 'high' : 'moderate',
      message: `Data Quality Issue: ${Math.round(missingPercent)}% of response fields are empty`,
    })
    suggestions.push('Review survey design to reduce incomplete responses')
  }

  return { score, issues, suggestions }
}

// ===== Question Bias =====
function detectQuestionBias(fields) {
  const issues = []
  const suggestions = []
  let score = 5

  // Check for leading/loaded question indicators in field names
  const biasedPatterns = [
    { pattern: /\b(best|worst|favorite|greatest|amazing|terrible|horrible)\b/i, type: 'Leading Language' },
    { pattern: /\b(don't you think|wouldn't you|isn't it|aren't you|shouldn't)\b/i, type: 'Leading Question' },
    { pattern: /\b(always|never|everyone|nobody|all|none)\b/i, type: 'Absolute Language' },
    { pattern: /\b(obviously|clearly|certainly|definitely|of course)\b/i, type: 'Presumptive Language' },
    { pattern: /\b(agree|disagree|support|oppose)\b/i, type: 'Directional Language' },
  ]

  const flaggedQuestions = []

  fields.forEach(field => {
    biasedPatterns.forEach(({ pattern, type }) => {
      if (pattern.test(field)) {
        flaggedQuestions.push({ field, type })
      }
    })
  })

  if (flaggedQuestions.length > 0) {
    score = Math.min(80, 20 + flaggedQuestions.length * 15)
    const uniqueTypes = [...new Set(flaggedQuestions.map(q => q.type))]

    flaggedQuestions.slice(0, 3).forEach(q => {
      issues.push({
        type: 'Question Bias',
        severity: 'moderate',
        message: `${q.type} in question: "${truncate(q.field, 60)}"`,
      })
    })

    suggestions.push('Rewrite leading or emotionally loaded questions in neutral form')
    if (uniqueTypes.includes('Absolute Language')) {
      suggestions.push('Replace absolute terms (always, never) with more nuanced options')
    }
    if (uniqueTypes.includes('Leading Question')) {
      suggestions.push('Rephrase questions to avoid implying a preferred answer')
    }
  }

  return { score, issues, suggestions }
}

// ===== Utility Functions =====
function findFieldsByPattern(fields, patterns) {
  return fields.filter(field =>
    patterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()))
  )
}

function getDistribution(data, field) {
  const dist = {}
  data.forEach(row => {
    let val = row[field]
    if (val === undefined || val === null || val.toString().trim() === '') {
      val = '(empty)'
    } else {
      val = val.toString().trim()
    }
    dist[val] = (dist[val] || 0) + 1
  })
  // Remove empty if it's not the majority
  const total = Object.values(dist).reduce((a, b) => a + b, 0)
  if (dist['(empty)'] && dist['(empty)'] / total < 0.3) {
    delete dist['(empty)']
  }
  return dist
}

function truncate(str, len) {
  return str.length > len ? str.substring(0, len) + '…' : str
}
