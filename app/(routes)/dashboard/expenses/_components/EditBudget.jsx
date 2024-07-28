"use client";
import { Button } from '@/components/ui/button';
import { PenBox } from 'lucide-react';
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogClose
} from '@/components/ui/dialog';
import { db } from '@/utils/dbconfig';
import { eq } from 'drizzle-orm';
import { Budgets } from '@/utils/schema';
import toast from 'react-hot-toast';

function EditBudget({ budgetInfo, refreshData }) {
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon || '');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState(budgetInfo?.name || '');
    const [amount, setAmount] = useState(budgetInfo?.amount || '');

    const { user } = useUser();

    const onUpdateBudget = async () => {
        try {
            const result = await db.update(Budgets).set({
                name: name,
                amount: parseFloat(amount),
                icon: emojiIcon,
            }).where(eq(Budgets.id, budgetInfo.id)).returning();
            
            if (result) {
                refreshData();
                toast.success('Budget Updated!');
            }
        } catch (error) {
            toast.error('Failed to update budget!');
            console.error(error);
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex gap-2"><PenBox />Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Budget</DialogTitle>
                        <DialogDescription>
                            <div>
                                <Button size="lg" variant="outline" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                    {emojiIcon ? emojiIcon : "Pick an emoji"}
                                </Button>
                                {openEmojiPicker && (
                                    <div className='absolute'>
                                        <EmojiPicker
                                            onEmojiClick={(e, emojiObject) => {
                                                setEmojiIcon(emojiObject.emoji);
                                                setOpenEmojiPicker(false);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <Input
                                        placeholder="e.g. Home Decor"
                                        defaultValue={budgetInfo?.name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 1000$"
                                        defaultValue={budgetInfo?.amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)}
                                onClick={onUpdateBudget}
                                className='mt-5 w-full'
                            >
                                Update Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EditBudget;
