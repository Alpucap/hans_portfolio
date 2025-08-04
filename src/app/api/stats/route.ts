import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma'; 

const prisma = new PrismaClient();

export async function GET() {
    const skills = await prisma.skillCard.count();
    const experiences = await prisma.experienceData.count();
    const projects = 0;

    return NextResponse.json({ skills, projects, experiences});
}
