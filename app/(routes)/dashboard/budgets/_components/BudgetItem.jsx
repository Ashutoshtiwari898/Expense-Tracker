import React from 'react';
import Link from 'next/link'; // Import Link from next/link

function BudgetItem({ budget }) {
    const calculateProgressPerc = () => {
        if (budget.amount === 0) return '0'; // Prevent division by zero
        const perc = (budget.totalSpend / budget.amount) * 100;
        return Math.min(perc, 100).toFixed(2); // Limit the percentage to a maximum of 100%
    }

    return (
        <Link href={`/dashboard/expenses/${budget?.id}`} >
            <div className='p-5 border rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white h-[170px]'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <h2 className='text-2xl p-3 px-4 bg-slate-100 rounded-full'>
                        {budget?.icon}
                    </h2>
                    <div>
                        <h2 className='font-bold text-lg'>
                            {budget.name}
                        </h2>
                        <h2 className='text-sm text-gray-500'>
                            {budget.totalItem} Item{budget.totalItem > 1 ? 's' : ''}
                        </h2>
                    </div>
                </div>
                <h2 className='font-bold text-primary text-lg'>${budget.amount}</h2>
            </div>
            <div className='mt-5'>
                <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center'>
                        <div className='w-1 h-4 bg-blue-500 rounded-full mr-2'></div>
                        <h2 className='text-sm text-slate-400'>
                            ${budget.totalSpend ? budget.totalSpend.toFixed(2) : 0} Spend
                        </h2>
                    </div>
                    <h2 className='text-sm text-slate-400'>
                        ${budget.amount - budget.totalSpend} Remaining
                    </h2>
                </div>
                <div className='w-full bg-slate-300 h-2 rounded-full'>
                    <div
                        className='bg-primary h-2 rounded-full'
                        style={{ width: `${calculateProgressPerc()}%` }}
                    />
                </div>
            </div>
            </div>
        </Link>
    );
}

export default BudgetItem;
