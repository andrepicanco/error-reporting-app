#!/bin/bash

# Check if config.js exists in gh-pages branch
echo "Checking gh-pages branch for config.js..."
git fetch origin gh-pages
git checkout gh-pages
if [ -f config.js ]; then
    echo "✅ config.js exists in gh-pages branch"
    echo "Contents (without sensitive data):"
    sed 's/apiKey:.*,/apiKey: "***",/' config.js | sed 's/clientId:.*,/clientId: "***",/'
else
    echo "❌ config.js is missing from gh-pages branch"
fi

# Switch back to main branch
git checkout main 