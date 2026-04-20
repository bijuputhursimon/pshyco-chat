📖 Catholic Bible Study App – User’s Guide
Welcome to the Catholic Bible Study Agent. This application automatically retrieves the Daily Mass readings from the United States Conference of Catholic Bishops (USCCB) website and uses the Gemini AI model to generate critical study questions and answers in Malayalam.

🚀 Getting Started
1. Obtain a Gemini API Key
To interact with the AI, you need a Google Gemini API Key.

Go to the Google AI Studio.

Generate a free API key.

Paste this key into the API Key field at the top of the application.

2. Running the Daily Study
Once your key is entered, click the "Run USCCB Study" button.

Fetching: The app contacts the USCCB website via a proxy (allorigins) to bypass security restrictions.

Extraction: The app identifies "Reading 1," "Reading 2," and the "Gospel" for the current date.

AI Analysis: The verse citations are sent to Gemini with a specialized prompt to generate deep theological questions and answers in Malayalam.

🛠 Features & Functionality
Liturgical Integration
The app is hard-coded to fetch the readings for today's date. It follows the Roman Catholic Liturgical Calendar, ensuring you are always studying the same verses being read at Mass globally.

Dual-Language Output
While the input verses are in English, the AI is instructed to provide the theological breakdown in Malayalam. This includes:

Exact Verse Quotes: The specific scripture being discussed.

Critical Questions: Provocative questions to help you meditate on the text.

Detailed Answers: Responses rooted in the Bible and the Catechism of the Catholic Church.

⚠️ Troubleshooting
"Fetch Failed" or "Not Found"
Internet Connection: Ensure you are online.

Proxy Issues: The app uses api.allorigins.win. If this service is temporarily down, the app cannot "see" the USCCB website. Try again after a few minutes.

USCCB Structure: If the USCCB changes its website layout, the extractReading function may need a small update to look for new text patterns.

"Invalid API Key"
Ensure there are no extra spaces when you paste your Gemini key.

Verify that your key hasn't expired or reached its free tier limit.

Why is Reading 2 "None"?
In the Catholic Church, daily weekday Masses typically only have two readings (Reading 1 and the Gospel). Reading 2 usually only appears on Sundays and major Solemnities. The app is designed to recognize this and will display "None" correctly on weekdays.

🛡 Security Note
Your API Key is handled locally in your browser. It is not stored on a server. However, if you are using a public computer, always refresh the page or close the browser when you are finished to clear your key from the input field.

Prayer before Study
"Come, Holy Spirit, fill the hearts of Thy faithful and enkindle in them the fire of Thy love. Send forth Thy Spirit and they shall be created. And Thou shalt renew the face of the earth."
