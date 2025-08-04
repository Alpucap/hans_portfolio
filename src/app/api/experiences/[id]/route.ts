import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient(); 

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; 
        const body = await req.json();
        const updated = await prisma.experienceData.update({
            where: { id: Number(id) },
            data: body,
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Error updating experience' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; 
        await prisma.experienceData.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Error deleting experience' }, { status: 500 });
    }
}