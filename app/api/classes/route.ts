import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
  try {
    const dbData = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(dbData);
  } catch (error) {
    // Se il file non esiste, restituisci una struttura vuota
    if (error.code === 'ENOENT') {
      return { classes: [], badges: [] };
    }
    throw error;
  }
}

export async function GET() {
  try {
    const data = await readDb();
    return NextResponse.json(data.classes);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, studentCount } = await request.json();
    const data = await readDb();

    const newClass = {
      id: crypto.randomBytes(4).toString('hex'),
      name,
      students: Array.from({ length: studentCount }, () => ({
        id: `${name}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      })),
    };

    data.classes.push(newClass);
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
