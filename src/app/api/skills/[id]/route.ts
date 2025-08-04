import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params; 
        const id = parseInt(paramId);
        
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const skill = await prisma.skillCard.findUnique({
            where: { id }
        });

        if (!skill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(skill);
    } catch (error) {
        console.error('Error fetching skill:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skill' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params; // Await params dan destructure id
        const id = parseInt(paramId);
        const body = await request.json();
        const { title, skills, link } = body;

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        if (!title || !skills) {
            return NextResponse.json(
                { error: 'Title and skills are required' },
                { status: 400 }
            );
        }

        const existingSkill = await prisma.skillCard.findUnique({
            where: { id }
        });

        if (!existingSkill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        const updatedSkill = await prisma.skillCard.update({
            where: { id },
            data: {
                title,
                skills,
                link
            }
        });

        return NextResponse.json(updatedSkill);
    } catch (error) {
        console.error('Error updating skill:', error);
        return NextResponse.json(
            { error: 'Failed to update skill' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params; 
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const existingSkill = await prisma.skillCard.findUnique({
            where: { id }
        });

        if (!existingSkill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        await prisma.skillCard.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Skill deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting skill:', error);
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        );
    }
}