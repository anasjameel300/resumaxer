# Future Roadmap & Technical Debt

## 🚀 Job Matcher (Visual Keyword Analysis)
- [ ] **Backend**: Update `analyzeResume` prompt to return structured JSON output for missing keywords.
    - Format: `{ missing_keywords: ["React", "AWS"], match_score: 85 }`
- [ ] **Frontend**: Create a `KeywordGapDashboard` component in `ResumeAnalysis.tsx`.
    - Display "Detected Missing" keywords as red badges.
    - Animate them turning green when the user adds them (or when AI auto-injects).

## 🗺️ Career Pathfinder (Salary & Guide)
- [ ] **Data Enrichment**: Integrate with a salary data API (e.g., Levels.fyi or Glassdoor) to show real "Salary Potential" for next steps.
- [ ] **Detailed Guides**: Add a "How to get there" drawer for each roadmap step.
    - Content: "To move from Senior Engineer to Lead, you need to master System Design. Recommended Book: DDIA."
