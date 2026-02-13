# ✨ Lumora
### Converse with your data.

![License](https://img.shields.io/badge/license-MIT-amber.svg)
![Version](https://img.shields.io/badge/version-1.0.0-F59E0B.svg)
![Stack](https://img.shields.io/badge/tech-React%20%7C%20DuckDB%20%7C%20AI-white.svg)

**Lumora** is not just a dashboard. It is an intelligent, conversational layer between you and your raw data. By fusing local SQL execution engines with state-of-the-art Large Language Models (LLMs), Lumora transforms the tedious task of data analysis into a seamless, natural dialogue.

Forget complex pivot tables. Forget writing SQL boilerplate. Just ask.

---

## 🚀 Why Lumora?

Most data tools are cold, rigid, and require steep learning curves. Lumora is designed to feel **alive**.

*   **🧠 Cognitive SQL Generation**: Lumora doesn't just "guess." It understands your data's schema, infers context, and architects precise, executable SQL queries on the fly using advanced LLM reasoning.
*   **⚡ Zero-Latency Edge Computing**: Unlike competitors that queue your jobs on sluggish remote servers, Lumora leverages an in-browser SQL engine (AlaSQL). Your data is analyzed **instantly** on your own machine.
*   **🎨 Luminous Aesthetic**: Built with a "Warm Noir" design philosophy. Glassmorphic panels, amber accents, and fluid micro-interactions create an environment that induces flow state.
*   **🔒 Privacy-First Architecture**: Your full dataset never leaves your browser. Only the schema is shared with the AI to generate queries, ensuring your sensitive metrics stay local.

---

## 💎 Standout Features

### 1. The Kinetic Sidebar & Instant Ingestion
Drag and drop CSV or Excel files and watch Lumora instantly parse, type-check, and ingest your data.
*   **Auto-Schema Detection**: Instantly identifies dates, numbers, and strings.
*   **Proactive Suggestions**: The moment your data lands, Lumora generates "One-Click Insights" based on your specific columns.

### 2. Conversational Intelligence
Stop fighting with syntax.
*   *You ask:* "Show me the trend of revenue over the last 6 months."
*   *Lumora executes:* `SELECT DATE_TRUNC('month', date), SUM(revenue) ...`
*   *Lumora explains:* "I've grouped the sales by month. It looks like you had a spike in Q3."

### 3. Adaptive Visualization Engine
Lumora doesn't just dump numbers. It creates art.
*   **Context-Aware Charting**: The agent automatically selects the perfect visualization (Line for trends, Bar for comparisons, Pie for distributions) based on the shape of the returned data.
*   **Interactive Tooltips**: Hover over data points for deep-dive metrics.

### 4. Multi-Model Orchestration via OpenRouter
You are not locked in.
*   **Bring Your Own Intelligence**: Plug in your OpenRouter API key and switch between **Google Gemini**, **GPT-4o**, **Claude 3.5 Sonnet**, or **Llama 3**.
*   **Cost Control**: You control the model, you control the cost.

---

## 🛠 Tech Stack

Built with a modern, high-performance stack designed for speed and maintainability:

*   **Frontend**: React 19 + TypeScript (The gold standard for interactive UIs).
*   **Styling**: Tailwind CSS with custom "Warm" color palette and fluid animations.
*   **Data Engine**: AlaSQL (Client-side SQL database).
*   **Parsing**: PapaParse (CSV) & SheetJS (Excel).
*   **Visualization**: Recharts (Composable, responsive charting).
*   **Icons**: Lucide React.
*   **AI Layer**: Custom OpenRouter integration.

---

## ⚡ Quick Start

Experience the future of data analysis in less than 2 minutes.

### Prerequisites
*   Node.js (v16+)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/lumora.git
    cd lumora
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Ignite the application**
    ```bash
    npm start
    ```

4.  Open `http://localhost:3000` and witness your data come to life.

---

## 🔑 Configuration

To unlock the full conversational power of Lumora:

1.  Click the **Sidebar**.
2.  Navigate to **Model Configuration**.
3.  Select **OpenRouter**.
4.  Enter your **API Key** (Get one at [openrouter.ai](https://openrouter.ai)).
5.  (Optional) Specify your preferred model (Default: `google/gemini-2.0-flash-lite-preview-02-05:free`).

---

## 🔮 The Roadmap

Lumora is evolving. Coming soon:
*   **Export to PDF/PPT**: Turn your conversation into a boardroom-ready presentation.
*   **Multi-File Joins**: conversational analysis across multiple uploaded datasets.
*   **Voice Mode**: Literally converse with your data using speech-to-text.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with 🧡 by Akshat.</p>
</div>
