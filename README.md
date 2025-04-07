## Instructions to Run the Project

1. Ensure that **MongoDB** and **Node.js** are installed on your system.
    - You can download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
    - You can download and install Node.js from [https://nodejs.org/](https://nodejs.org/).

2. Clone the project repository to your local machine.

3. Navigate to the project directory in your terminal.

4. Create a `.env` file in the root directory of the project and add the following variables:
    ```plaintext
    MONGO_URI=mongodb://localhost:27017/your_database_name
    PORT=3000
    ```

5. Run the following command to install the required dependencies:
    ```bash
    npm install
    ```

6. Start the project by running:
    ```bash
    npm run dev
    ```

7. The application should now be running. Follow any additional instructions provided in the project documentation for usage.