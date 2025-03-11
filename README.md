Event Hub
==========

This project aims to provide a platform for event sharing. The platform allows event organizers to post event information. Besides event organizers, the platform provides users with a convenient way to discover events and share their feedback.


# Installation:

```bash
# if not at EventHub root directory
cd EventHub

# Install dependencies
npm install
cd frontend
npm install
cd ..

# Install dotenv
npm install dotenv

# Set up environment variables
cp .env.example .env

# To start the application
npm run dev

# Default PORT is 4000. if it is unavaliable, go .env file and replace 4000 with another port and start the application again
# After starting the application successfully, in the terminal, Ctrl + click on the "Local: " link
```
