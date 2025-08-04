
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const experiences = await prisma.experienceData.findMany({
        orderBy: {
            order: 'asc',
        },
        });

        return NextResponse.json(experiences);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        return NextResponse.json(
        { error: 'Failed to fetch experiences' },
        { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, company, startDate, description, tools, isActive, order } = body;

        const experience = await prisma.experienceData.create({
        data: {
            title,
            company,
            startDate,
            description,
            tools,
            isActive: isActive || false,
            order,
        },
        });

        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error('Error creating experience:', error);
        return NextResponse.json(
        { error: 'Failed to create experience' },
        { status: 500 }
        );
    }
}