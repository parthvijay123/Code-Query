# Code-Query

Code-Query is a modern Q&A platform, inspired by StackOverflow, built to facilitate knowledge sharing and community engagement. It leverages the power of Next.js 15 for a responsive frontend, PostgreSQL with Prisma for a robust backend, and Google's Gemini AI to provide intelligent assistance.

## 🚀 Features

-   **Q&A System**: Ask questions, provide answers, and engage in threaded discussions (comments).
-   **Voting Mechanism**: Upvote or downvote questions and answers to highlight quality content.
-   **AI Integration**: Utilizes Google Gemini AI to assist users with answers or suggestions.
-   **Authentication**: Secure user authentication and management via NextAuth (Auth.js) and PostgreSQL.
-   **Responsive Design**: Built with TailwindCSS and Next.js for a seamless experience across devices.
-   **Markdown Support**: Write and render rich text content using Markdown.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js 15](https://nextjs.org/) (React 19)
-   **Backend**: PostgreSQL, [Prisma ORM](https://www.prisma.io/)
-   **Authentication**: [NextAuth.js](https://authjs.dev/)
-   **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
-   **AI**: [Google Gemini](https://deepmind.google/technologies/gemini/)
-   **Language**: TypeScript

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js**: Version 18 or higher.
-   **PostgreSQL**: A running PostgreSQL instance.
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

1.  Create a `.env` file in the root directory.
2.  Add the following environment variables:

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/queryflow?schema=public"

    # Authentication
    AUTH_SECRET="your-generated-secret" # Generate with `openssl rand -base64 32`

    # Gemini Configuration
    GEMINI_API_KEY=your-gemini-api-key
    ```

### Database Setup

1.  Push the schema to your database:
    ```bash
    npx prisma db push
    ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `app/`: App Router pages and layouts.
-   `components/`: Reusable UI components.
-   `models/`: Server-side actions (`server/`) and Prisma configuration.
-   `prisma/`: Database schema and migrations.
-   `auth.ts`: NextAuth configuration.
-   `public/`: Static assets.

## 🤝 Contributing

Contributions are welcome!

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
