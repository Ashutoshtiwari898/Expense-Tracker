import { Expenses } from '@/utils/schema';

import { Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';
import { db } from '@/utils/dbconfig';
import { eq } from 'drizzle-orm';



function ExpenseListTable({ expensesList,refreshData }) {
    const deleteExpense =async(expense)=>{
        const result=await db.delete(Expenses)
        .where(eq(Expenses.id,expense.id))
        .returning();

        if(result){
            toast('Expense Deleted!')
            refreshData();
        }
    }
    return (
        <div className='mt-3'>
            <h2 className='font-bold text-lg'>Latest Expenses</h2>
            <div className='grid grid-cols-4 bg-slate-200 p-2 mt-3'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {expensesList.map((expense ,index)=> (
                <div key={expense.id} className='grid grid-cols-4 bg-slate-50 p-2'>
                    <h2>{expense.name}</h2>
                    <h2>{expense.amount}</h2>
                    <h2>{expense.createdAt}</h2>
                    < Trash className='text-red-600 cursor-pointer'
                    onClick={()=>deleteExpense(Expenses)}
                    
                    />
                </div>
            ))}
        </div>
    );
}

export default ExpenseListTable;