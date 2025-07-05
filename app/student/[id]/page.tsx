"use client";

import { useEffect, useState } from 'react';
import BadgePatch from '@/components/BadgePatch';

interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
}

interface StudentData {
  id: string;
  assignedBadges: Badge[];
}

export default function StudentBadgesPage({ params }: { params: { id: string } }) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const res = await fetch(`/api/students/${params.id}`);
      const data = await res.json();
      setStudentData(data);
    };
    fetchStudentData();
  }, [params.id]);

  if (!studentData) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">I tuoi Badge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentData.assignedBadges.length === 0 ? (
              <p>Nessun badge assegnato.</p>
            ) : (
              studentData.assignedBadges.map((badge) => (
                <BadgePatch key={badge.id} badge={badge} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
