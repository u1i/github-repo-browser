# GitHub Repository Browser

A modern web application built with React and Vite that allows you to browse GitHub repositories with a sleek user interface. Features include:

- 🌓 Light/Dark mode toggle
- 🔍 Smart search functionality
- 🔒 Private repository support with GitHub token
- 🔄 Sorting options (by date, stars)
- 🎯 Filter for private repositories
- 💅 Modern UI with shadcn/ui components

## Development with Docker

### Prerequisites

- Docker installed on your machine
- Git (to clone the repository)

### Running the Development Server

To run the application in development mode with hot-reload:

```bash
# Build the image
docker build -t github-browser .

# Run development server
docker run -it \
  -p 5173:5173 \
  -v $(pwd)/src:/app/src \
  github-browser
```

The application will be available at `http://localhost:5173`. Changes to files in the `src` directory will trigger hot-reload.

### Building the Application

To build the application and get the static files:

```bash
# Run build command and output to local dist directory
docker run -it \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/dist:/app/dist \
  github-browser npm run build
```

The built files will be available in your local `dist` directory.

## Usage

1. Access the application through your browser
2. Navigate to a GitHub user's repositories by adding their username to the URL (e.g., `/octocat`)
3. (Optional) Add your GitHub token to view private repositories
4. Use the search bar to filter repositories
5. Sort repositories by creation date or stars
6. Toggle between light and dark mode as needed
7. Use the "Private repos only" switch to filter private repositories

## Environment Variables

No environment variables are required for basic functionality. GitHub API is used without authentication for public repositories.

## Notes

- The GitHub API has rate limiting for unauthenticated requests
- Adding a GitHub token increases the rate limit and enables private repository access
- Tokens are stored in the browser's local storage