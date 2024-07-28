import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbconfig';
import { Budgets, Expenses } from '@/utils/schema';
import { toast } from 'react-toastify';
import moment from 'moment';

function AddExpense({ budgetId, user,refreshData }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const addNewExpense = async () => {
        try {
            const result = await db.insert(Expenses).values({
                name: name,
                amount: parseFloat(amount), // Ensure amount is a number
                budgetId: budgetId,
                createdAt: moment().format('DD/MM/YYYY')// Assuming this is the user identification
               
            }).returning({insertedId:Budgets.id}); // Return all columns or specify fields if needed

            console.log(result);
            if (result) {
                refreshData()
                toast.success('New Expense Added!');
                // Clear input fields after successful addition
                setName('');
                setAmount('');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error('Failed to add expense');
        }
    };

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input 
                    placeholder="e.g. Bedroom Decor"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input 
                    placeholder="e.g. 1000"
                    type="number" // Ensure the input is of type number
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} 
                />
            </div>
            <Button 
                disabled={!(name && amount)}
                onClick={addNewExpense}
                className="mt-3 w-full"
            >
                Add New Expense
            </Button>
        </div>
    );
}

export default AddExpense;
