"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import CreateClassModal from '@/components/CreateClassModal';

interface Class {
  id: string;
  name: string;
}

export default function Home() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Le tue Classi</h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Crea Nuova Classe
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((c) => (
              <Link key={c.id} href={`/class/${c.id}`}>
                <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900">{c.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <CreateClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onClassCreated={fetchClasses} 
      />
    </div>
  );
}
