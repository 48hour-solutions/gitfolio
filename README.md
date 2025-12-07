<div align="center">
  <h1>GitFolio</h1>
  <p>Universal GitHub portfolio generator and developer search engine powered by AI</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase_Genkit-1.8-FFCA28?style=flat&logo=firebase&logoColor=black">
  <img src="https://img.shields.io/badge/Google_Gemini-2.0-8E75B2?style=flat&logo=google&logoColor=white">
</p>

<div align="center">
  <h2>Overview</h2>
</div>

<div align="center">
  <p>GitFolio is an intelligent developer portfolio generator that leverages AI to transform raw GitHub data into professional, shareable profiles. It goes beyond simple statistics by analyzing coding styles, domain expertise, and technical strengths using Google's Gemini models via Firebase Genkit. Additionally, it features a natural language search engine to find developers based on specific skills and experiences.</p>
</div>

<div align="center">
  <h2>Core Features</h2>
</div>

<div align="center">
<table>
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>AI Profile Synthesis</td>
    <td>Converts raw GitHub data into structured professional profiles with inferred skills</td>
  </tr>
  <tr>
    <td>Smart Developer Search</td>
    <td>Natural language search engine for finding candidates based on complex criteria</td>
  </tr>
  <tr>
    <td>Tech Stack Analysis</td>
    <td>Automatically identifies top languages, frameworks, and coding patterns</td>
  </tr>
  <tr>
    <td>Keyword Extraction</td>
    <td>Intelligent parsing of job descriptions and queries to isolate technical terms</td>
  </tr>
  <tr>
    <td>Instant Report Generation</td>
    <td>Creates shareable, professionally designed portfolio pages on demand</td>
  </tr>
</table>
</div>

<div align="center">
  <h2>AI Capabilities</h2>
</div>

<div align="center">
  <p>Powered by Firebase Genkit and Google Gemini, GitFolio employs specialized AI flows.</p>
</div>

<div align="center">
<table>
  <tr>
    <th>Flow Name</th>
    <th>Description</th>
    <th>Input/Output</th>
  </tr>
  <tr>
    <td><code>synthesizeGithubProfileFlow</code></td>
    <td>Analyzes repositories and activity to determine domain expertise and coding style</td>
    <td>GitHub Data &rarr; Structured Profile</td>
  </tr>
  <tr>
    <td><code>findDevelopersFlow</code></td>
    <td>Ranks developer candidates with reasoning based on query alignment</td>
    <td>Query & Profiles &rarr; Ranked Candidates</td>
  </tr>
  <tr>
    <td><code>extractKeywordsFlow</code></td>
    <td>Extracts technical skills and concepts from natural language input</td>
    <td>User Query &rarr; Keywords List</td>
  </tr>
</table>
</div>

<div align="center">
  <h2>Installation</h2>
</div>

<div align="center">
  <p><strong>Prerequisites</strong></p>
  <p>Node.js 18+, GitHub Personal Access Token, Google GenAI API Key</p>
</div>

<div align="center">
  ```bash
  git clone <repository-url>
  cd nextn
  npm install
  ```
</div>

<div align="center">
  <h2>Configuration</h2>
</div>

<div align="center">
  <p>Create a <code>.env.local</code> file in the root directory with the following variables:</p>
</div>

<div align="center">
  ```bash
  GITHUB_TOKEN=your_github_token_here
  GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
  ```
</div>

<div align="center">
  <h2>Usage</h2>
</div>

<div align="center">
  <p>Start the development server to use the application:</p>
</div>

<div align="center">
  ```bash
  npm run dev
  ```
</div>

<div align="center">
  <p>Start the Genkit Developer UI to inspect AI flows:</p>
</div>

<div align="center">
  ```bash
  npm run genkit:dev
  ```
</div>

<div align="center">
  <h2>Development</h2>
</div>

<div align="center">
  ```bash
  # Run type checking
  npm run typecheck

  # Lint code
  npm run lint

  # Build for production
  npm run build
  ```
</div>

<div align="center">
  <h2>Architecture</h2>
</div>

<div align="center">
  <p>The application is built using the Next.js App Router and integrated with Firebase Genkit for AI operations.</p>
</div>

<div align="center">
<table>
  <tr>
    <th>Component</th>
    <th>Tech Stack</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Frontend</td>
    <td>Next.js 15, React, Tailwind CSS</td>
    <td>Responsive UI with Radix UI components</td>
  </tr>
  <tr>
    <td>AI Engine</td>
    <td>Firebase Genkit, Google Gemini</td>
    <td>Server-side AI flows for data analysis</td>
  </tr>
  <tr>
    <td>Data Source</td>
    <td>GitHub API</td>
    <td>Fetches user repositories and contributions</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>Firebase App Hosting</td>
    <td>Scalable serverless hosting configuration</td>
  </tr>
</table>
</div>

<div align="center">
  <h2>Contributing</h2>
</div>

<div align="center">
  <p>Contributions are welcome. Please ensure all new features are accompanied by appropriate tests.</p>
</div>

<div align="center">
  <h2>License</h2>
</div>

<div align="center">
  <p>Private / Proprietary</p>
</div>

<div align="center">
  <h2>Acknowledgments</h2>
</div>

<div align="center">
<table>
  <tr>
    <th>Resource</th>
    <th>Usage</th>
  </tr>
  <tr>
    <td><a href="https://nextjs.org">Next.js</a></td>
    <td>React Framework</td>
  </tr>
  <tr>
    <td><a href="https://firebase.google.com/docs/genkit">Firebase Genkit</a></td>
    <td>AI Integration</td>
  </tr>
  <tr>
    <td><a href="https://ui.shadcn.com">shadcn/ui</a></td>
    <td>UI Components</td>
  </tr>
  <tr>
    <td><a href="https://lucide.dev">Lucide</a></td>
    <td>Icons</td>
  </tr>
</table>
</div>
