# MongoDB Installation Instructions

Before running the application, you need to install and configure MongoDB:

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community

2. Follow the installation wizard and make sure to:
   - Install MongoDB as a Service
   - Install MongoDB Compass (the GUI tool)

3. After installation, the MongoDB service should start automatically
   - If not, you can start it manually:
     ```powershell
     net start MongoDB
     ```

4. Verify the connection:
   - Open MongoDB Compass
   - Connect to: mongodb://localhost:27017
   - Create a new database named "api-tester"

Note: The application is configured to use the following MongoDB URI:
```
mongodb://localhost:27017/api-tester
```