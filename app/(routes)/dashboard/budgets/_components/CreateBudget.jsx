"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'; // Ensure this import matches your setup
import { db } from '@/utils/dbconfig'; // Ensure this import matches your setup

function CreateBudget({ refreshData }) {
    const [emojiIcon, setEmojiIcon] = useState('');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const { user } = useUser();

    const onCreateBudget = async () => {
        const result = await db.insert(Budgets)
            .values({
                name: name,
                amount: parseFloat(amount), // Ensure the amount is a number
                createdBy: user?.primaryEmailAddress?.emailAddress,
                icon: emojiIcon,
            }).returning({ insertedId: Budgets.id });

        if (result) {
            refreshData();
            // Replace this with your toast library function if you have one
            alert('New Budget Created!');
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
                        <h2 className='text-3xl'>+</h2>
                        <h2>Create New Budget</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input
                                        type="number" 
                                        placeholder="e.g. 1000$"
                                        value={amount}
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
                                onClick={onCreateBudget} className='mt-5 w-full'>Create Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateBudget;
