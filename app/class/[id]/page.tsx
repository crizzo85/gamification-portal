"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Html5QrcodeScanner } from 'html5-qrcode';
import BadgePatch from '@/components/BadgePatch';
import ConfirmationModal from '@/components/ConfirmationModal';
import Notification from '@/components/Notification';

interface Student {
  id: string;
  badges?: string[];
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

export default function ClassPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState("");
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [studentIdInput, setStudentIdInput] = useState<string>('');
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<string | null>(null);

  const fetchClassData = async () => {
    const res = await fetch(`/api/classes/${params.id}`);
    if (!res.ok) {
      router.push('/'); // Torna alla home se la classe non esiste
      return;
    }
    const data = await res.json();
    setClassData(data);
    setClassName(data.name);
  };

  const fetchBadges = async () => {
    const res = await fetch('/api/badges');
    const data = await res.json();
    setBadges(data);
  };

  useEffect(() => {
    fetchClassData();
    fetchBadges();
  }, [params.id]);

  const handleUpdateClassName = async () => {
    await fetch(`/api/classes/${params.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: className }),
      }
    );
    setIsEditing(false);
    fetchClassData();
    setNotification({ message: 'Nome classe aggiornato!', type: 'success' });
  };

  const handleDeleteClass = async () => {
    await fetch(`/api/classes/${params.id}`, { method: 'DELETE' });
    router.push('/');
  };

  useEffect(() => {
    if (classData) {
      const generateQrCodes = async () => {
        const codes: Record<string, string> = {};
        for (const student of classData.students) {
          codes[student.id] = await QRCode.toDataURL(student.id);
        }
        setQrCodes(codes);
      };
      generateQrCodes();
    }
  }, [classData]);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: { width: 250, height: 250 },
          fps: 5,
        },
        false
      );

      const onScanSuccess = (decodedText: string, decodedResult: any) => {
        setStudentIdInput(decodedText);
        setShowScanner(false);
        scanner.clear();
      };

      const onScanError = (errorMessage: string) => {
        // console.warn(errorMessage);
      };

      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner]);

  const handleAssignBadge = async () => {
    if (!selectedBadge || !studentIdInput) {
      setNotification({ message: 'Seleziona un badge e inserisci un ID studente.', type: 'error' });
      return;
    }

    await fetch(`/api/classes/${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId: studentIdInput, badgeId: selectedBadge }),
    });
    setNotification({ message: 'Badge assegnato con successo!', type: 'success' });
    setStudentIdInput('');
    setSelectedBadge('');
    fetchClassData(); // Aggiorna i dati della classe per mostrare il badge assegnato
  };

  const handleRemoveBadge = async (studentId: string, badgeId: string) => {
    await fetch(`/api/classes/${params.id}/remove-badge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, badgeId }),
    });
    setNotification({ message: 'Badge rimosso con successo!', type: 'success' });
    fetchClassData(); // Aggiorna i dati della classe
  };

  const handleAddStudent = async () => {
    await fetch(`/api/classes/${params.id}/add-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), // Non serve più studentName
    });
    setNotification({ message: 'Studente aggiunto con successo!', type: 'success' });
    fetchClassData();
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;
    await fetch(`/api/classes/${params.id}/remove-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: studentToRemove }),
    });
    setNotification({ message: 'Studente rimosso con successo!', type: 'success' });
    setIsRemoveStudentModalOpen(false);
    setStudentToRemove(null);
    fetchClassData();
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    let yPos = 10;
    doc.text(`Classe: ${classData?.name}`, 10, yPos);
    yPos += 10;

    classData?.students.forEach((student, index) => {
      yPos += 10; // Spazio per l'ID dello studente
      doc.text(`${index + 1}. ${student.id}`, 10, yPos);
      
      const qrCodeDataUrl = qrCodes[student.id];
      if (qrCodeDataUrl) {
        yPos += 2; // Piccolo spazio tra testo e immagine
        doc.addImage(qrCodeDataUrl, 'PNG', 15, yPos, 30, 30); // x, y, width, height
        yPos += 30; // Spazio per l'immagine del QR code
      }
      yPos += 5; // Spazio tra uno studente e l'altro

      // Aggiungi una nuova pagina se lo spazio sta per finire
      if (yPos > 280) { // Circa la fine di una pagina A4
        doc.addPage();
        yPos = 10; // Reset posizione Y per la nuova pagina
      }
    });
    doc.save(`${classData?.name}_studenti.pdf`);
  };

  const exportToExcel = () => {
    const studentDataForExcel = classData?.students.map(student => ({
      'ID Studente': student.id,
      'QR Code (URL)': qrCodes[student.id] || 'N/A',
      'Badge Assegnati': student.badges ? student.badges.map(bId => badges.find(b => b.id === bId)?.name || bId).join(', ') : 'Nessuno'
    })) || [];
    const worksheet = XLSX.utils.json_to_sheet(studentDataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Studenti');
    XLSX.writeFile(workbook, `${classData?.name}_studenti.xlsx`);
  };

  if (!classData) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClass}
        title="Conferma Eliminazione Classe"
        message={`Sei sicuro di voler eliminare la classe "${classData?.name}"? L'azione è irreversibile.`}
      />
      <ConfirmationModal
        isOpen={isRemoveStudentModalOpen}
        onClose={() => setIsRemoveStudentModalOpen(false)}
        onConfirm={handleRemoveStudent}
        title="Conferma Rimozione Studente"
        message={`Sei sicuro di voler rimuovere lo studente "${studentToRemove}"? L'azione è irreversibile.`}
      />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {isEditing ? (
                <input 
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-gray-800">Classe: {classData.name}</h2>
              )}
              {isEditing ? (
                <div className="ml-4">
                  <button onClick={handleUpdateClassName} className="text-green-500 hover:text-green-700">Salva</button>
                  <button onClick={() => setIsEditing(false)} className="ml-2 text-red-500 hover:text-red-700">Annulla</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="ml-4 text-gray-500 hover:text-gray-700">Modifica</button>
              )}
            </div>
            <div>
              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                Elimina Classe
              </button>
              <button onClick={exportToPdf} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                Esporta PDF
              </button>
              <button onClick={exportToExcel} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Esporta Excel
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aggiungi/Rimuovi Studenti</h2>
            <div className="flex mb-4">
              <button onClick={handleAddStudent} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Aggiungi Studente
              </button>
            </div>

            <ul className="divide-y divide-gray-200">
              {classData.students.map((student) => (
                <li key={student.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">{student.id}</span>
                  <div className="flex items-center">
                    {student.badges && student.badges.length > 0 && (
                      <div className="flex flex-wrap items-center mr-4">
                        {student.badges.map(bId => {
                          const badge = badges.find(b => b.id === bId);
                          return badge ? (
                            <div key={bId} className="mr-2">
                              <BadgePatch badge={badge} onRemove={() => handleRemoveBadge(student.id, bId)} compact={true} />
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    <img src={qrCodes[student.id]} alt={`QR code for ${student.id}`} className="w-20 h-20 mr-4" />
                    <a 
                      href={qrCodes[student.id]}
                      download={`${student.id}_qrcode.png`}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Download QR
                    </a>
                    <button 
                      onClick={() => {
                        setStudentToRemove(student.id);
                        setIsRemoveStudentModalOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Rimuovi
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assegna Badge</h2>
            <div className="mb-4">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">ID Studente:</label>
              <input
                type="text"
                id="studentId"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <button 
                onClick={() => setShowScanner(!showScanner)}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                {showScanner ? 'Chiudi Scanner' : 'Scansiona QR Code'}
              </button>
              {showScanner && <div id="reader" className="mt-4"></div>}
            </div>
            <div className="mb-4">
              <label htmlFor="badgeSelect" className="block text-sm font-medium text-gray-700">Seleziona Badge:</label>
              <select
                id="badgeSelect"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
              >
                <option value="">Seleziona un badge</option>
                {badges.map((badge) => (
                  <option key={badge.id} value={badge.id}>
                    {badge.name}
                  </option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleAssignBadge}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Assegna Badge
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}