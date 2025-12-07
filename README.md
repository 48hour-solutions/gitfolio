<div align="center">
  <h1>GitFolio</h1>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15.3.3-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js"></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
    <a href="https://firebase.google.com"><img src="https://img.shields.io/badge/Firebase-11.9-FFCA28?style=flat&logo=firebase&logoColor=black" alt="Firebase"></a>
    <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini"></a>
  </p>

  <p>
    An AI-powered portfolio generator for your GitHub profile
  </p>

  <br>

  <h2>Features</h2>
  <table>
    <tr>
        <th>Feature</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><b>Narrative Professional Summary</b></td>
        <td>An advanced AI analyzes a developer's entire public footprint—code, commit patterns, and repository themes—to generate a professional, narrative-style summary that reads like a high-quality bio.</td>
    </tr>
    <tr>
        <td><b>Holistic Developer Score</b></td>
        <td>A unique "Developer Score" (0-100) is calculated to holistically evaluate a profile's impact, considering commit activity, repository quality, and community validation. The score is fully auditable with a detailed breakdown.</td>
    </tr>
     <tr>
        <td><b>Automated Skill & Language Analysis</b></td>
        <td>The AI infers high-level skills (e.g., "API Design," "Game Development") from repository content and provides concise insights into the developer's demonstrated experience with their top languages.</td>
    </tr>
    <tr>
        <td><b>Intelligent Data Aggregation</b></td>
        <td>The system intelligently processes all of a user's repositories, filtering out forked projects and non-programming languages to provide clean, meaningful statistics on their original work.</td>
    </tr>
  </table>

  <h3>Developer Search</h3>
  <p>A powerful tool for recruiters and team leads to find ideal candidates within the GitFolio database.</p>

  <table>
    <tr>
        <th>Feature</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><b>Natural Language Search Engine</b></td>
        <td>Users can describe their ideal candidate in conversational language (e.g., "Find me a Python developer who has worked with automation tools and has experience with tensorflow").</td>
    </tr>
    <tr>
        <td><b>AI-Driven Candidate Ranking</b></td>
        <td>A multi-stage AI pipeline extracts key technical concepts from the query, then analyzes and ranks the most suitable candidates from the entire database.</td>
    </tr>
    <tr>
        <td><b>Personalized Match Reasoning</b></td>
        <td>For each search result, the AI provides a concise, one-sentence justification explaining why the candidate is a strong match, citing specific skills or project experience.</td>
    </tr>
  </table>

  <h3>Professional Export & Sharing</h3>
  <p>GitFolio provides tangible assets that can be used in portfolios, resumes, and professional profiles.</p>

   <table>
    <tr>
        <th>Feature</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><b>Self-Contained HTML Export</b></td>
        <td>Download a profile as a single, fully interactive HTML file. All styling, data, and even pop-up dialogs are preserved.</td>
    </tr>
    <tr>
        <td><b>GitHub-Ready Markdown Generation</b></td>
        <td>Generate a complete, well-structured Markdown report of the profile, perfect for pasting directly into a README.md. The tool includes a live preview and a one-click copy button.</td>
    </tr>
    <tr>
        <td><b>Clean, Shareable Profile URLs</b></td>
        <td>Every generated profile is accessible via a clean, semantic URL, making it simple to share a live, always-up-to-date professional summary.</td>
    </tr>
  </table>

  <br>

  <h2>Environment Setup</h2>
  <p>Create a <code>.env</code> file in the root directory with the following variables:</p>

  <table>
    <tr>
      <th>Variable</th>
      <th>Description</th>
    </tr>
    <tr>
      <td><code>GITHUB_TOKEN</code></td>
      <td>GitHub Personal Access Token. Required to increase the API rate limit for fetching user and repository data.</td>
    </tr>
    <tr>
      <td><code>GEMINI_API_KEY</code></td>
      <td>Google Gemini API Key. Required for all AI-powered features, including profile synthesis and developer search.</td>
    </tr>
  </table>

  <br>

  <h2>Usage</h2>
  <p>Run the development server:</p>
  <pre>npm run dev</pre>

  <p>Start the Genkit developer UI:</p>
  <pre>npm run genkit:dev</pre>

  <br>

  <h2>Showcase</h2>
  <img src="https://github.com/user-attachments/assets/93cdc056-ce00-4e6e-adff-f08bdd803ad3" alt="Showcase 1">
  <br><br>
  <img src="https://github.com/user-attachments/assets/693bc7d7-f293-486a-b9f7-ecd6a0296fc7" alt="Showcase 2">
  <br><br>
  <img src="https://github.com/user-attachments/assets/b51b8904-c68b-4cc0-ba85-df7d04bc5c36" alt="Showcase 3">
  <br><br>
  <img src="https://github.com/user-attachments/assets/7eaefff6-bcb9-4712-810e-3e8e66e1c6a2" alt="Showcase 4">
</div>
