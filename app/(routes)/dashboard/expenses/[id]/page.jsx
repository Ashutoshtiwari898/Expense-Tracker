"use client"; // Add this line at the top to mark the component as a Client Component

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/dbconfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable'; // Correct import

function ExpensesScreen({ params }) {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState(null); // Initialize as null
    const [expensesList, setExpensesList] = useState([]); // Fixed variable name

    useEffect(() => {
        if (user && params.id) {
            getBudgetInfo();
        }
    }, [user, params.id]);

    const getBudgetInfo = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number)
            })
            .from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id, params.id))
            .groupBy(Budgets.id);

            setBudgetInfo(result[0] || null); // Handle empty result gracefully
        } catch (error) {
            console.error('Error fetching budget info:', error);
        }
        fetchExpensesList(); // Ensure fetchExpensesList is called here
    };

    const fetchExpensesList = async () => {
        try {
            const result = await db.select().from(Expenses)
                .where(eq(Expenses.budgetId, params.id))
                .orderBy(desc(Expenses.id));
            setExpensesList(result); // Fix typo 'ressult' to 'result'
            console.log(result);
        } catch (error) {
            console.error('Error fetching expenses list:', error);
        }
    };

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold'>My Expenses</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
                )}
                <AddExpense
                    budgetId={params.id}
                    user={user}
                    refreshData={getBudgetInfo()}
                />
            </div>
            <div className='mt-4'>
                <h2 className='font-bold text-lg'>Latest Expenses</h2>
                <ExpenseListTable expensesList={expensesList}
                refreshData={()=>getBudgetInfo()}
                /> {/* Correct component name */}
            </div>
        </div>
    );
}

export default ExpensesScreen;
