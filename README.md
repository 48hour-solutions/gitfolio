<div align="center">
  <h1>GitFolio</h1>
  <p>An AI-powered portfolio generator for your GitHub profile</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Language-TypeScript-blue" alt="Language">
  <img src="https://img.shields.io/badge/Framework-Next.js-black" alt="Framework">
  <img src="https://img.shields.io/badge/Platform-Firebase-orange" alt="Platform">
</p>

<div align="center">
  <h2>Overview</h2>
  <p>GitFolio is an advanced tool that leverages artificial intelligence to analyze GitHub profiles and generate professional portfolios. By examining code, commit patterns, and repository structures, it creates narrative summaries and detailed developer scores.</p>
  <p>Built with Next.js and Firebase Genkit, it offers a seamless way to visualize developer achievements, understand skill sets through AI inference, and export these insights for professional use.</p>
</div>

<div align="center">
  <h2>Core Features</h2>
  <table>
    <tr><th>Feature</th><th>Description</th></tr>
    <tr><td>Narrative Professional Summary</td><td>Generates bio-like summaries by analyzing public footprint and commit history.</td></tr>
    <tr><td>Holistic Developer Score</td><td>Calculates a 0-100 score based on commit activity, impact, and community influence.</td></tr>
    <tr><td>Skill & Language Analysis</td><td>Infers high-level skills and provides insights into language proficiency.</td></tr>
    <tr><td>Intelligent Data Aggregation</td><td>Filters forks and non-code repositories to provide accurate statistics.</td></tr>
  </table>
</div>

<div align="center">
  <h2>Advanced Capabilities</h2>
  <table>
    <tr><th>Capability</th><th>Details</th></tr>
    <tr><td>Developer Search</td><td>Natural language search to find candidates with AI-driven ranking and reasoning.</td></tr>
    <tr><td>Export Options</td><td>Download profiles as self-contained HTML or generate Markdown reports.</td></tr>
  </table>
</div>

<div align="center">
  <h2>Installation</h2>
  <p>Ensure Node.js is installed. Clone the repository and install dependencies.</p>
</div>

<div align="center">
  ```bash
  npm install
  ```
</div>

<div align="center">
  <h2>Usage</h2>
  <p>Start the Next.js development server.</p>
</div>

<div align="center">
  ```bash
  npm run dev
  ```
</div>

<div align="center">
  <p>To work with Genkit flows locally:</p>
</div>

<div align="center">
  ```bash
  npm run genkit:dev
  ```
</div>

<div align="center">
  <h2>Configuration</h2>
  <p>Create a .env file in the root directory with the following keys.</p>
</div>

<div align="center">
  ```env
  GITHUB_TOKEN="your_github_token"
  GEMINI_API_KEY="your_gemini_api_key"
  ```
</div>

<div align="center">
  <h2>Development</h2>
  <p>Run code quality checks and type verification.</p>
</div>

<div align="center">
  ```bash
  npm run lint
  npm run typecheck
  ```
</div>

<div align="center">
  <h2>Architecture</h2>
  <p>GitFolio utilizes a modern stack centered around Next.js and AI services.</p>
  <table>
    <tr><th>Component</th><th>Technology</th><th>Responsibility</th></tr>
    <tr><td>Frontend</td><td>Next.js 15, React, Tailwind</td><td>UI rendering, routing, and user interaction.</td></tr>
    <tr><td>AI Engine</td><td>Firebase Genkit, Google Gemini</td><td>Profile synthesis, candidate ranking, and reasoning.</td></tr>
    <tr><td>Data Handling</td><td>Server Actions, Zod</td><td>Fetching GitHub data and input validation.</td></tr>
    <tr><td>Hosting</td><td>Firebase App Hosting</td><td>Deployment and scaling.</td></tr>
  </table>
</div>

<div align="center">
  <h2>Contributing</h2>
  <p>Contributions are welcome. Please ensure all tests pass before submitting a pull request.</p>
</div>

<div align="center">
  <h2>License</h2>
  <p>This project is private and has no specified license.</p>
</div>

<div align="center">
  <h2>Acknowledgments</h2>
  <p>Powered by Next.js, Firebase, and Google Gemini. UI components by Radix UI and Lucide.</p>
</div>
