# Healthcare Entry System

This is a simple healthcare entry system built with Node.js, Express, and MongoDB. It provides an API to manage treatment records.

## Features

- Add new treatment records.
- Validate required fields for treatment records.
- Store data in MongoDB.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd healthcare-entry-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure MongoDB**:
   - Update the `MONGO_URI` in `server/index.js` with your MongoDB connection string.

4. **Start the server**:
   ```bash
   node server/index.js
   ```

5. **Access the API**:
   - The server will run on `http://localhost:5000`.
   - Use tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/) to test the API.

## API Endpoints

### POST `/api/treatments`

**Description**: Add a new treatment record.

**Request Body**:
```json
{
  "patientName": "John Doe",
  "patientId": "12345",
  "treatmentDate": "2023-10-01",
  "treatmentDescription": ["Checkup", "X-ray"],
  "prescribedMedication": ["Medicine A", "Medicine B"],
  "treatmentCost": 200
}
```

**Response**:
- **201 Created**: Returns the created treatment record.
- **400 Bad Request**: Missing required fields.
- **500 Internal Server Error**: Server error.

## Notes

- Ensure your MongoDB instance is running and accessible.
- Replace `<repository-url>` with the actual repository URL when cloning.

## License

This project is licensed under the MIT License.
