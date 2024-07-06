"use client";
import React, { useEffect } from 'react';
import SideNav from './_components/sideNav';
import DashboardHeader from './_components/DashboardHeader';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/dbconfig';
import { useRouter } from 'next/navigation';

function DashboardLayout({ children }) {
    const { user } = useUser();
    const router = useRouter();

    const checkUserBudgets = async () => {
        const result = await db.select()
            .from(Budgets)
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));
        console.log(result);
        if (result?.length == 0) {
            router.replace('/dashboard/budgets');
        }
    };

    useEffect(() => {
        if (user) {
            checkUserBudgets();
        }
    }, [user]);

    return (
        <div>
            <div className='fixed md:w-64 hidden md:block'>
                <SideNav />
            </div>
            <div className='md:ml-64'>
                <DashboardHeader />
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;