// Google Sheets API configuration
const SHEET_NAME = 'ErrorReports';

// Check if configuration is available
if (typeof CONFIG === 'undefined') {
    console.error('Configuration not found. Please ensure config.js is loaded correctly.');
    showError('Application configuration is missing. Please contact support.');
    throw new Error('Configuration not found');
}

// Debug configuration
console.log('Configuration loaded:', {
    hasApiKey: !!CONFIG.apiKey,
    hasClientId: !!CONFIG.clientId,
    hasSpreadsheetId: !!CONFIG.spreadsheetId,
    clientIdLength: CONFIG.clientId ? CONFIG.clientId.length : 0,
    clientIdPrefix: CONFIG.clientId ? CONFIG.clientId.substring(0, 10) + '...' : 'none'
});

// Initialize Google API
async function initGoogleAPI() {
    try {
        // Validate required configuration
        if (!CONFIG.apiKey || !CONFIG.clientId || !CONFIG.spreadsheetId) {
            console.error('Missing configuration:', {
                apiKey: !!CONFIG.apiKey,
                clientId: !!CONFIG.clientId,
                spreadsheetId: !!CONFIG.spreadsheetId
            });
            throw new Error('Missing required configuration');
        }

        // Load the Google API client library
        await new Promise((resolve, reject) => {
            gapi.load('client', resolve);
        });

        // Initialize the client
        await gapi.client.init({
            apiKey: CONFIG.apiKey,
            clientId: CONFIG.clientId,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        });

        // Initialize auth2
        await new Promise((resolve, reject) => {
            gapi.auth2.init({
                client_id: CONFIG.clientId
            }).then(resolve, reject);
        });

        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    } catch (error) {
        console.error('Error initializing Google API:', error);
        showError('Failed to initialize Google API. Please refresh the page and try again.');
    }
}

// Show error message to user
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.container').prepend(errorDiv);
}

// Update UI based on sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log('User is signed in');
    } else {
        console.log('User is not signed in');
        // Sign in the user
        gapi.auth2.getAuthInstance().signIn().catch(error => {
            console.error('Error signing in:', error);
            showError('Failed to sign in. Please try again.');
        });
    }
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('errorForm');
    form.addEventListener('submit', handleSubmit);
    
    // Add paste event listener to the entire document
    document.addEventListener('paste', handlePaste);

    // Initialize Google API
    initGoogleAPI();
});

// Handle paste event
async function handlePaste(event) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            event.preventDefault();
            const file = item.getAsFile();
            await handlePastedImage(file);
            break;
        }
    }
}

// Handle pasted image
async function handlePastedImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const pastedImageContainer = document.getElementById('pastedImage');
        const pastedImagePreview = document.getElementById('pastedImagePreview');
        
        pastedImagePreview.src = e.target.result;
        pastedImageContainer.classList.remove('hidden');
        
        // Store the file for later use
        pastedImageContainer.dataset.file = file;
    };
    reader.readAsDataURL(file);
}

// Remove pasted image
function removePastedImage() {
    const pastedImageContainer = document.getElementById('pastedImage');
    const pastedImagePreview = document.getElementById('pastedImagePreview');
    
    pastedImagePreview.src = '';
    pastedImageContainer.classList.add('hidden');
    delete pastedImageContainer.dataset.file;
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    const formData = {
        title: document.getElementById('errorTitle').value,
        errorType: document.getElementById('errorType').value,
        description: document.getElementById('description').value,
        timestamp: new Date().toISOString(),
        evidence: await handleEvidence()
    };

    try {
        await submitToGoogleSheets(formData);
        showConfirmation();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your report. Please try again.');
    }
}

// Handle evidence (screenshot or URL)
async function handleEvidence() {
    const screenshotInput = document.getElementById('screenshot');
    const urlInput = document.getElementById('evidenceUrl');
    const pastedImageContainer = document.getElementById('pastedImage');

    if (pastedImageContainer.dataset.file) {
        const file = pastedImageContainer.dataset.file;
        // In a real implementation, you would upload this to a storage service
        // and return the URL. For now, we'll just return the filename
        return `Pasted Screenshot: ${file.name}`;
    } else if (screenshotInput.files.length > 0) {
        const file = screenshotInput.files[0];
        return `Screenshot: ${file.name}`;
    } else if (urlInput.value) {
        return `URL: ${urlInput.value}`;
    }
    return 'No evidence provided';
}

// Submit data to Google Sheets
async function submitToGoogleSheets(data) {
    try {
        // Ensure user is signed in
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            await gapi.auth2.getAuthInstance().signIn();
        }

        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: CONFIG.spreadsheetId,
            range: `${CONFIG.sheetName}!A:F`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[
                    data.timestamp,
                    data.title,
                    data.errorType,
                    data.description || '', // Handle optional description
                    data.evidence
                ]]
            }
        });

        console.log('Data submitted successfully:', response);
        return response;
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        throw error;
    }
}

// Show confirmation message
function showConfirmation() {
    const form = document.getElementById('errorForm');
    const confirmation = document.getElementById('confirmation');
    
    form.style.display = 'none';
    confirmation.classList.remove('hidden');
}

// Reset form for new submission
function resetForm() {
    const form = document.getElementById('errorForm');
    const confirmation = document.getElementById('confirmation');
    
    form.reset();
    removePastedImage();
    form.style.display = 'block';
    confirmation.classList.add('hidden');
} 