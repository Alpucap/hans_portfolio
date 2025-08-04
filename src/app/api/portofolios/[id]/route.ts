import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const parsedId = parseInt(id);
        const body = await request.json();

        const {
            title,
            description,
            technologies,
            category,
            imageUrls,
            projectUrl,
            githubUrl,
            isActive
        } = body;

        if (!title || !description || !category) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const portfolio = await prisma.portfolio.update({
            where: { id: parsedId },
            data: {
                title,
                description,
                technologies: technologies || [],
                category,
                imageUrls: imageUrls || [],
                projectUrl: projectUrl || null,
                githubUrl: githubUrl || null,
                isActive
            }
        });

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Error updating portfolio:', error);
        return new NextResponse('Failed to update portfolio', { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const parsedId = parseInt(id);

        await prisma.portfolio.delete({
            where: { id: parsedId }
        });

        return new NextResponse('Portfolio deleted successfully', { status: 200 });
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        return new NextResponse('Failed to delete portfolio', { status: 500 });
    }
}