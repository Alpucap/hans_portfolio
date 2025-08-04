import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
    const skills = await prisma.skillCard.findMany();
    return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, skills, link } = body;

        if (!title || !skills) {
            return NextResponse.json(
                { error: 'Title and skills are required' },
                { status: 400 }
            );
        }

        const newSkill = await prisma.skillCard.create({
            data: {
                title,
                skills,
                link
            }
        });

        return NextResponse.json(newSkill, { status: 201 });
    } catch (error) {
        console.error('Error creating skill:', error);
        return NextResponse.json(
            { error: 'Failed to create skill' },
            { status: 500 }
        );
    }
}


