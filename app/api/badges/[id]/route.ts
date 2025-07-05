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

// Recupera un singolo badge
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const data = await readDb();
  const badge = data.badges.find((b: any) => b.id === params.id);
  if (!badge) {
    return new NextResponse('Badge not found', { status: 404 });
  }
  return NextResponse.json(badge);
}

// Modifica un badge
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedBadgeData = await request.json();
  const data = await readDb();
  const badgeIndex = data.badges.findIndex((b: any) => b.id === params.id);

  if (badgeIndex === -1) {
    return new NextResponse('Badge not found', { status: 404 });
  }

  data.badges[badgeIndex] = { ...data.badges[badgeIndex], ...updatedBadgeData };
  await writeDb(data);

  return NextResponse.json(data.badges[badgeIndex]);
}

// Elimina un badge e i suoi riferimenti dagli studenti
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const data = await readDb();
  const initialBadgeCount = data.badges.length;

  // Rimuovi il badge dalla lista principale
  data.badges = data.badges.filter((b: any) => b.id !== params.id);

  if (data.badges.length === initialBadgeCount) {
    return new NextResponse('Badge not found', { status: 404 });
  }

  // Rimuovi il badge da tutti gli studenti che lo possiedono
  data.classes.forEach((classItem: any) => {
    classItem.students.forEach((student: any) => {
      if (student.badges) {
        student.badges = student.badges.filter((badgeId: string) => badgeId !== params.id);
      }
    });
  });

  await writeDb(data);

  return new NextResponse(null, { status: 204 }); // No Content
}
