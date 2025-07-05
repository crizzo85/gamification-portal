import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
  try {
    const dbData = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(dbData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { classes: [], badges: [] };
    }
    throw error;
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await readDb();
    let studentData = null;

    for (const classItem of data.classes) {
      const foundStudent = classItem.students.find((s) => s.id === params.id);
      if (foundStudent) {
        studentData = foundStudent;
        break;
      }
    }

    if (!studentData) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Recupera i dettagli dei badge assegnati
    const assignedBadges = studentData.badges?.map(badgeId => 
      data.badges.find(b => b.id === badgeId)
    ).filter(Boolean) || [];

    return NextResponse.json({ ...studentData, assignedBadges });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
