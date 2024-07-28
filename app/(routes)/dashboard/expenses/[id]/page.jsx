"use client"; // Add this line at the top to mark the component as a Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js app directory
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbconfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable'; // Correct import
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'react-toastify';

function ExpensesScreen({ params }) {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState(null); // Initialize as null
    const [expensesList, setExpensesList] = useState([]); // Fixed variable name
    const router = useRouter(); // Correct variable name

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

    const deleteBudget = async () => {
        try {
            const deleteExpenseResult = await db.delete(Expenses)
                .where(eq(Expenses.budgetId, params.id))
                .returning();

            if (deleteExpenseResult) {
                await db.delete(Budgets)
                    .where(eq(Budgets.id, params.id))
                    .returning();
            }

            toast('Budget Deleted');
            router.replace('/dashboard/budgets');
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>
                My Expenses
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="flex gap-2" variant="destructive">
                            <Trash /> Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your Budget
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
                )}
                <AddExpense
                    budgetId={params.id}
                    user={user}
                    refreshData={getBudgetInfo}
                />
            </div>
            <div className='mt-4'>
                <h2 className='font-bold text-lg'>Latest Expenses</h2>
                <ExpenseListTable
                    expensesList={expensesList}
                    refreshData={getBudgetInfo}
                /> {/* Correct component name */}
            </div>
        </div>
    );
}

export default ExpensesScreen;
