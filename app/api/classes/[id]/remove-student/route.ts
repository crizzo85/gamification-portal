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
    const { studentId } = await request.json(); // ID dello studente da rimuovere
    const data = await readDb();
    const classIndex = data.classes.findIndex((c: any) => c.id === params.id);

    if (classIndex === -1) {
      return new NextResponse('Class not found', { status: 404 });
    }

    const initialStudentCount = data.classes[classIndex].students.length;
    data.classes[classIndex].students = data.classes[classIndex].students.filter((s: any) => s.id !== studentId);

    if (data.classes[classIndex].students.length === initialStudentCount) {
      return new NextResponse('Student not found', { status: 404 });
    }

    await writeDb(data);

    return NextResponse.json({ message: 'Student removed successfully' });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
