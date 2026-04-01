# FairCheck AI – Survey Bias Auditor 🔍

> **Built for [Build with AI Hackathon](https://github.com/gtech-mulearn/build-with-ai) by GTech MuLearn**

---

## Problem Statement

AI systems trained on biased survey data inherit and amplify those biases — leading to unfair outcomes in hiring, healthcare, lending, and beyond. Surveys collected via Google Forms and similar platforms often contain hidden biases such as **gender imbalance, age skew, response time clustering, and leading questions**. Currently, there is no simple tool for non-technical users to audit their survey datasets for these biases before the data enters an AI pipeline.

**FairCheck AI** solves this by providing a one-click bias audit for survey CSV files — detecting, measuring, and visualizing bias so users can fix it before it causes harm.

---

## Project Description

**FairCheck AI** is a modern web application that lets users upload survey datasets (CSV files) and instantly detects multiple types of bias:

| Bias Type | What It Detects |
|---|---|
| **Demographic Bias** | Gender imbalance, age skew, lack of ethnic diversity |
| **Temporal Bias** | Responses clustered on specific days or times |
| **Sampling Bias** | Small sample sizes, low response diversity, missing data |
| **Question Bias** | Leading, loaded, or presumptive question language |

### How It Works

```
Upload CSV → Parse & Analyze → Detect Biases → Score & Visualize → Suggest Fixes
```

1. **Upload** — Drag and drop any survey CSV file (Google Forms, Typeform, SurveyMonkey, etc.)
2. **Analyze** — The system parses the CSV and runs 4 bias detection algorithms
3. **Score** — An overall **Bias Score (0-100%)** is calculated with color-coded severity:
   - 🟢 **Green** — Low Bias (0–34%)
   - 🟡 **Yellow** — Moderate Bias (35–59%)
   - 🔴 **Red** — High Bias (60–100%)
4. **Visualize** — Pie charts, bar charts, and a speedometer gauge display the findings
5. **Recommend** — Actionable suggestions are provided to reduce each detected bias

### AI Integration

FairCheck AI uses **intelligent pattern recognition** powered by AI concepts to:

- **Detect demographic patterns** — Automatically identifies gender, age, ethnicity, and location columns using NLP-based field matching, then calculates distribution imbalances
- **Analyze question language** — Uses pattern matching with bias-indicator lexicons (leading language, absolute terms, presumptive phrases) to flag potentially biased survey questions
- **Score bias severity** — A weighted multi-factor scoring algorithm combines all bias signals into a single actionable score
- **Generate smart recommendations** — Context-aware suggestions are generated based on the specific biases detected in the dataset

---

## Proof of Google AI Usage

Screenshots demonstrating Google AI tool usage are stored in the `/proof` folder:

```
/proof
  ├── gemini_code_generation.png
  ├── gemini_bias_algorithm.png
  └── gemini_ui_design.png
```

> 📎 *Google Gemini was used for code generation assistance, bias detection algorithm design, and UI/UX prototyping throughout the development of FairCheck AI.*

---

## Screenshots

### 🔐 Login Page
Clean, modern login with Google Sign-In and Demo User access.
![Uploading login.png…]()


### 📊 Dashboard
Drag-and-drop CSV upload with bias type info cards.
<img width="1918" height="871" alt="dashboard" src="https://github.com/user-attachments/assets/6f488b82-8e7f-408e-9e5e-026c2fcdeb3b" />


### ⏳ Analysis In Progress
Animated multi-step analysis with real-time progress.
<img width="1436" height="728" alt="analysis" src="https://github.com/user-attachments/assets/9022ecae-138b-407f-a962-07abe9a14e07" />



### 📋 Bias Report — Gauge Meter
SVG speedometer showing overall Bias Score with color-coded severity.

<img width="1910" height="926" alt="gauge meter" src="https://github.com/user-attachments/assets/6af3a931-35fe-4adf-8eb2-90365873a946" />


### ⚠️ Detected Issues & Recommendations
Severity-tagged issues with actionable fix suggestions.
<img width="1918" height="810" alt="recommendations" src="https://github.com/user-attachments/assets/46e86609-c531-40a4-9f83-d3f7a4183117" />


### 📈 Visualizations
Pie charts for gender distribution, bar charts for temporal analysis.


---
<img width="1918" height="901" alt="pie chart" src="https://github.com/user-attachments/assets/9945a191-7833-44b5-929b-6be54d822a11" />

## Demo Video

Upload your demo video to Google Drive and paste the shareable link here (max 3 minutes).

[▶️ Watch Demo Video](https://drive.google.com/file/d/1HyJdmaCrjDGtFQAoKsFGd3MneOixkeWc/view?usp=drive_link)

---

## Installation Steps

```bash
# Clone the repository
git clone https://github.com/layatomy/faircheckAI.git

# Go to project folder
cd faircheckAI/faircheck-app

# Install dependencies
npm install

# Run the project
npm run dev
```



## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Frontend UI framework |
| **Vite 8** | Fast dev server and build tool |
| **React Router v7** | Page navigation |
| **Chart.js 4** | Data visualization (pie & bar charts) |
| **PapaParse** | CSV file parsing |
| **Vanilla CSS** | Custom dark glassmorphism design system |
| **Google Gemini** | AI-assisted development |

---

## Project Structure

```
faircheckAI/
├── faircheck-app/
│   ├── public/
│   │   └── sample-survey.csv         # Test CSV with intentional biases
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx            # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Google Sign-In page
│   │   │   ├── DashboardPage.jsx     # CSV upload interface
│   │   │   ├── AnalyzingPage.jsx     # Loading animation
│   │   │   └── ResultsPage.jsx       # Gauge, charts, issues
│   │   ├── utils/
│   │   │   └── biasAnalyzer.js       # Core bias detection engine
│   │   ├── App.jsx                   # Router & state management
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Design system
│   ├── package.json
│   └── vite.config.js
├── proof/                             # Google AI usage screenshots
├── screenshots/                       # App screenshots
└── README.md
```

---


---

### Resources

- [Build with AI – Hackathon Repo](https://github.com/gtech-mulearn/build-with-ai)
- [React Documentation](https://react.dev)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [PapaParse Documentation](https://www.papaparse.com/docs)

### License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <strong>FairCheck AI</strong> — Because fairness in AI starts with fair data. 🔍
</p>
