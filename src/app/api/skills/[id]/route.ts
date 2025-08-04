import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const parsedId = parseInt(id);
        
        if (isNaN(parsedId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const skill = await prisma.skillCard.findUnique({
            where: { id: parsedId }
        });

        if (!skill) {
            return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        }

        return NextResponse.json(skill);
    } catch (error) {
        console.error('Error fetching skill:', error);
        return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const parsedId = parseInt(id);
        
        if (isNaN(parsedId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const body = await request.json();
        const { title, skills, link } = body;

        if (!title || !skills) {
            return NextResponse.json({ error: 'Title and skills are required' }, { status: 400 });
        }

        const existingSkill = await prisma.skillCard.findUnique({ where: { id: parsedId } });
        if (!existingSkill) {
            return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        }

        const updatedSkill = await prisma.skillCard.update({
            where: { id: parsedId },
            data: { title, skills, link }
        });

        return NextResponse.json(updatedSkill);
    } catch (error) {
        console.error('Error updating skill:', error);
        return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const parsedId = parseInt(id);
        
        if (isNaN(parsedId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const existingSkill = await prisma.skillCard.findUnique({ where: { id: parsedId } });
        if (!existingSkill) {
            return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        }

        await prisma.skillCard.delete({ where: { id: parsedId } });

        return NextResponse.json({ message: 'Skill deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting skill:', error);
        return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
    }
}