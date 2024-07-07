import 'dotenv/config';

export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://Expense-Tracker_owner:p1JHbqjXLU0n@ep-withered-dust-a5xu81w8.us-east-2.aws.neon.tech/Expense-Tracker?sslmode=require',
    }
};
