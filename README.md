# 🌐 LumenAI Translate

> **More than just words.** A smart, context-aware translator that understands nuance, slang, and multiple meanings.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Powered_by-Groq-orange?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Powered_by-Gemini-blue?style=for-the-badge)

## ✨ Features

![Alt Text](public/Screenshot_20260117_165531.png)

### 🧠 Dual-Model Intelligence
We use the right brain for the job:
*   **For Vocabulary (1-4 words)**: Uses **Llama 3.1 70B (via Groq)** to provide rich, dictionary-style definitions with visual emojis, pronunciation guides, and usage examples.
*   **For Sentences (5+ words)**: Automatically switches to **Gemini 1.5 Flash** for rapid, fluent, and accurate full-text translation.

### 🚀 Key Capabilities
*   **📚 Smart Dictionary**: Don't just get a word; get the *meaning*. See synonyms, parts of speech, and example sentences.
*   **🎭 Context-Aware**: Add optional context (e.g., "formal email", "slang", "medical") to get the perfect tone.
*   **📱 Installable App (PWA)**: Add to your mobile home screen and use it like a native app.
*   **⚡ Blazing Fast**: Powered by Groq's LPU inference engine for instant vocabulary lookups.
*   **🎨 Beautiful UI**: Glassmorphism design with full Dark Mode support and smooth animations.
*   **💾 History**: Automatically saves your translations locally so you never lose them.

## 🛠️ Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn
*   API Keys for [Groq](https://console.groq.com/) and [Gemini](https://aistudio.google.com/app/apikey)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/doniyor117/ai_translator.git
    cd ai_translator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```env
    # Groq API Key (for rich vocabulary)
    GROQ_API_KEY=gsk_your_groq_key_here

    # Gemini API Key (for sentences - Free Tier available)
    GEMINI_API_KEY=your_gemini_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📱 How to Install on Mobile

This app is a Progressive Web App (PWA).

*   **iOS**: Open in Safari → Tap 'Share' → Select 'Add to Home Screen'.
*   **Android**: Open in Chrome → Tap menu (⋮) → Select 'Install app'.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
