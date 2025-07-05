import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
  const dbData = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(dbData);
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { studentId, badgeId } = await request.json();
    const data = await readDb();
    const classIndex = data.classes.findIndex((c: any) => c.id === params.id);

    if (classIndex === -1) {
      return new NextResponse('Class not found', { status: 404 });
    }

    const studentIndex = data.classes[classIndex].students.findIndex((s: any) => s.id === studentId);

    if (studentIndex === -1) {
      return new NextResponse('Student not found', { status: 404 });
    }

    if (data.classes[classIndex].students[studentIndex].badges) {
      data.classes[classIndex].students[studentIndex].badges = 
        data.classes[classIndex].students[studentIndex].badges.filter((b: string) => b !== badgeId);
    }

    await writeDb(data);

    return NextResponse.json({ message: 'Badge removed successfully' });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
