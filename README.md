# Code-Query

Code-Query is a modern Q&A platform, inspired by StackOverflow, built to facilitate knowledge sharing and community engagement. It leverages the power of Next.js 15 for a responsive frontend, Appwrite for a robust backend, and Google's Gemini AI to provide intelligent assistance.

## 🚀 Features

-   **Q&A System**: Ask questions, provide answers, and engage in threaded discussions (comments).
-   **Voting Mechanism**: Upvote or downvote questions and answers to highlight quality content.
-   **AI Integration**: Utilizes Google Gemini AI to assist users with answers or suggestions.
-   **Authentication**: Secure user authentication and management via Appwrite.
-   **Responsive Design**: Built with TailwindCSS and Next.js for a seamless experience across devices.
-   **Markdown Support**: Write and render rich text content using Markdown.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js 15](https://nextjs.org/) (React 19)
-   **Backend**: [Appwrite](https://appwrite.io/) (Database, Auth, Storage)
-   **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
-   **AI**: [Google Gemini](https://deepmind.google/technologies/gemini/)
-   **State Management**: Zustand
-   **Language**: TypeScript

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js**: Version 18 or higher.
-   **Appwrite**: An active Appwrite instance (Cloud or Self-hosted).
-   **Gemini API Key**: An API key from Google AI Studio.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/Code-Query.git
    cd Code-Query
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Environment Setup

1.  Create a `.env.local` file in the root directory.
2.  Add the following environment variables. You can refer to `.env.example` if available or use the template below:

    ```env
    # Appwrite Configuration
    NEXT_PUBLIC_APPWRITE_HOST_URL=https://cloud.appwrite.io/v1 # or your self-hosted URL
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
    APPWRITE_API_KEY=your-secret-api-key

    # Gemini Configuration (if applicable, check implementation)
    # GEMINI_API_KEY=your-gemini-api-key
    ```

### Database Setup

The project includes a script to initialize the Appwrite database collections and attributes.

1.  Run the setup script:
    ```bash
    npx tsx scripts/test-db.ts
    ```
    This command will create the necessary databases and collections (`questions`, `answers`, `comments`, `votes`) in your Appwrite project.

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `app/`: App Router pages and layouts.
-   `components/`: Reusable UI components.
-   `models/`: Appwrite database schemas and server-side logic.
    -   `server/`: Server-side actions and configurations.
    -   `client/`: Client-side configurations.
-   `scripts/`: Utility scripts (e.g., database setup).
-   `store/`: State management (Zustand) stores.
-   `public/`: Static assets.

## 🤝 Contributing

Contributions are welcome! Here is how you can contribute:

1.  **Fork the Project**: Create your own copy of the repository.
2.  **Create a Branch**: `git checkout -b feature/AmazingFeature`
3.  **Commit Changes**: `git commit -m 'Add some AmazingFeature'`
4.  **Push to Branch**: `git push origin feature/AmazingFeature`
5.  **Open a Pull Request**: Submit your changes for review.

### Guidelines

-   Follow existing code style and conventions.
-   Ensure responsive design is maintained.
-   Test your changes thoroughly before submitting.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
