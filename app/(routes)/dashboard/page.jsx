"use client"
import { UserButton,useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbconfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';


function Dashboard() {
  
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));
    
    setBudgetList(result);
  };

  return (
    <div>
         <div className='p-5'>
          <h2 className='font-bold text-3xl'>Hii,{user?.fullName}😏</h2>
          <p className='text-gray-500'>Here's what happenning with your money,Lets Manage your expenses</p>
          <CardInfo budgetList={budgetList}/>
          
         </div>
    </div>
  )
}

export default Dashboard