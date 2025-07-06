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
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as any).code === 'ENOENT'
  ) {
    return { classes: [], badges: [] };
  }
  throw error;
}
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readDb();
    return NextResponse.json(data.badges);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, category, icon, color, stars } = await request.json();
    const data = await readDb();

    const newBadge = {
      id: crypto.randomBytes(4).toString('hex'),
      name,
      description,
      category,
      icon,
      color,
      stars: stars || 1, // Valore predefinito a 1 se non fornito
    };

    data.badges.push(newBadge);
    await writeDb(data);

    return NextResponse.json(newBadge, { status: 201 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


