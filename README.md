# Error Reporting App

A simple web application for reporting operational process failures and system bugs.

## Features

- Single-page form interface
- Quick error reporting (≤3 clicks)
- Support for text descriptions and screenshot uploads
- Google Sheets integration for data storage
- Auto-generated timestamps

## Setup

1. Clone this repository
2. Set up Google Sheets API:
   - Create a new Google Cloud Project
   - Enable Google Sheets API
   - Create credentials (OAuth 2.0 Client ID)
   - Create a Google Sheet and share it with the service account email
3. Configure the application:
   - Copy `config.template.js` to `config.js`
   - Update `config.js` with your Google API credentials
   - For production, use environment variables (see Production Setup below)
4. Open `index.html` in a web browser

## Configuration

### Development Setup
1. Copy `config.template.js` to `config.js`
2. Update the values in `config.js` with your actual credentials:
   ```javascript
   const CONFIG = {
       apiKey: 'YOUR_API_KEY',
       clientId: 'YOUR_CLIENT_ID',
       spreadsheetId: 'YOUR_SPREADSHEET_ID',
       sheetName: 'ErrorReports'
   };
   ```

### Production Setup
1. Set up environment variables:
   - Copy `.env.template` to `.env`
   - Update the values in `.env` with your production credentials
2. Use `config.prod.js` instead of `config.js`
3. Ensure your web server is configured to serve the correct configuration file

## Deployment

### Deploying to GitHub Pages

1. Create a new repository on GitHub
2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. Configure GitHub Pages:
   - Go to your repository settings
   - Scroll down to "GitHub Pages" section
   - Select "gh-pages" branch as source
   - Save the settings

4. Set up GitHub Secrets:
   - Go to repository settings
   - Navigate to "Secrets and variables" > "Actions"
   - Add the following secrets:
     - `GOOGLE_API_KEY`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_SPREADSHEET_ID`

5. The site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Security Notes
- Never commit `config.js` or `.env` files to version control
- Keep your API credentials secure
- Use environment variables in production
- Regularly rotate your API keys

## Technical Requirements

- Modern web browser
- Google Sheets API access
- Internet connection for API calls

## Usage

1. Open the application
2. Fill in the error details:
   - Error Title
   - Description
   - Upload screenshot or provide URL
3. Click Submit
4. Receive confirmation of submission

## Development

Built with:
- HTML5
- CSS3
- JavaScript
- Google Sheets API 