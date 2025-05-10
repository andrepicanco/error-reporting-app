// Production Configuration using environment variables
const CONFIG = {
    apiKey: process.env.GOOGLE_API_KEY,
    clientId: process.env.GOOGLE_CLIENT_ID,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    sheetName: process.env.GOOGLE_SHEET_NAME || 'ErrorReports'
}; 