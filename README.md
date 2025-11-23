# AI-Powered API Tester

A modern web application for testing APIs with AI-powered documentation and error explanation features.

## Features

- Send API requests (GET, POST, PUT, DELETE)
- View formatted JSON responses
- Automatic API documentation generation using AI
- AI-powered error explanations
- Request history tracking
- Clean and intuitive UI

## Tech Stack

- **Frontend:**
  - React with Vite
  - TailwindCSS for styling
  - React Query for state management
  - Axios for HTTP requests

- **Backend:**
  - Node.js with Express
  - MongoDB for data storage
  - OpenAI API for AI features
  - Axios for request forwarding

## Prerequisites

- Node.js 16.x or higher
- MongoDB installed and running
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-powered-api-tester.git
   cd ai-powered-api-tester
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and OpenAI API key
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/api-tester
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Usage

1. Enter the API URL and select the HTTP method
2. Add any required headers or request body
3. Click "Send Request"
4. View the response, AI-generated documentation, or error explanation
5. Check the history sidebar for previous requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the AI capabilities
- Postman for inspiration