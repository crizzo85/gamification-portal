import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

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
    const { studentName } = await request.json(); // Nome dello studente da aggiungere
    const data = await readDb();
    const classIndex = data.classes.findIndex((c: any) => c.id === params.id);

    if (classIndex === -1) {
      return new NextResponse('Class not found', { status: 404 });
    }

    const newStudentId = `${data.classes[classIndex].name}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const newStudent = { id: newStudentId };

    data.classes[classIndex].students.push(newStudent);
    await writeDb(data);

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
