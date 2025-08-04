// app/api/portfolios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const portfolios = await prisma.portfolio.findMany({
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json(portfolios);
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        return new NextResponse('Failed to fetch portfolios', { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            technologies,
            category,
            imageUrls,
            projectUrl,
            githubUrl,
            isActive = false
        } = body;

        // Validation
        if (!title || !description || !category) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const portfolio = await prisma.portfolio.create({
            data: {
                title,
                description,
                technologies: technologies ?? [],
                category,
                imageUrls: imageUrls ?? [],
                projectUrl: projectUrl ?? null,
                githubUrl: githubUrl ?? null,
                isActive
            }
        });

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Error creating portfolio:', error);
        return new NextResponse('Failed to create portfolio', { status: 500 });
    }
}
