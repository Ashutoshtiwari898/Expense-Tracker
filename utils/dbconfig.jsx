// dbconfig.js// dbconfig.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon('postgresql://Expense-Tracker_owner:p1JHbqjXLU0n@ep-withered-dust-a5xu81w8.us-east-2.aws.neon.tech/Expense-Tracker?sslmode=require');

const db = drizzle(sql, { schema });

export { db }; // Ensure db is properly exported
