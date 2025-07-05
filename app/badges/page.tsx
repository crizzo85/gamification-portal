"use client";

import { useEffect, useState } from 'react';
import BadgePatch from '@/components/BadgePatch';
import EditBadgeModal from '@/components/EditBadgeModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import ColorPicker from '@/components/ColorPicker';
import IconPicker from '@/components/IconPicker';
import SvgIcon from '@/components/SvgIcon';
import StarSelector from '@/components/StarSelector';
import { Badge } from '@/components/types';

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadge, setNewBadge] = useState<Omit<Badge, 'id'> & { id?: string }>({ name: '', description: '', category: '', icon: '', color: '', stars: 1 });
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isEditModalOpen, setIsEditModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModal] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const fetchBadges = async () => {
    const res = await fetch('/api/badges');
    const data = await res.json();
    setBadges(data);
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadge.icon || !newBadge.color) {
      alert('Per favore, seleziona un\'icona e un colore.');
      return;
    }
    await fetch('/api/badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBadge),
    });
    setNewBadge({ name: '', description: '', category: '', icon: '', color: '', stars: 1 });
    fetchBadges();
  };

  const handleOpenEditModal = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsEditModal(true);
  };

  const handleUpdateBadge = async (updatedBadge: Badge) => {
    await fetch(`/api/badges/${updatedBadge.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBadge),
    });
    setIsEditModal(false);
    fetchBadges();
  };

  const handleOpenDeleteModal = (badgeId: string) => {
    setBadgeToDelete(badgeId);
    setIsEditModal(false);
    setIsDeleteModal(true);
  };

  const handleDeleteBadge = async () => {
    if (!badgeToDelete) return;
    await fetch(`/api/badges/${badgeToDelete}`, { method: 'DELETE' });
    setIsDeleteModal(false);
    setBadgeToDelete(null);
    fetchBadges();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crea Nuovo Badge</h2>
            <form onSubmit={handleCreateBadge} className="bg-white p-6 rounded-lg shadow space-y-4">
              <input
                type="text"
                placeholder="Nome Badge"
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md"
                value={newBadge.name}
                onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
              />
              <textarea
                placeholder="Descrizione"
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md"
                value={newBadge.description}
                onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Categoria"
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md"
                value={newBadge.category}
                onChange={(e) => setNewBadge({ ...newBadge, category: e.target.value })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stelle:</label>
                <StarSelector count={newBadge.stars} onSelect={(stars) => setNewBadge({ ...newBadge, stars })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Icona:</label>
                <div 
                  className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md cursor-pointer flex items-center justify-between"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                >
                  {newBadge.icon ? (
                    <SvgIcon name={newBadge.icon} className="w-6 h-6 text-gray-700" />
                  ) : (
                    <span>Seleziona Icona</span>
                  )}
                  <span className="material-icons">arrow_drop_down</span>
                </div>
                {showIconPicker && (
                  <IconPicker 
                    selectedIcon={newBadge.icon} 
                    onSelectIcon={(icon) => {
                      setNewBadge({ ...newBadge, icon });
                      setShowIconPicker(false);
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Colore:</label>
                <div 
                  className={`w-full h-10 rounded-md cursor-pointer ${newBadge.color ? `bg-${newBadge.color}` : 'bg-gray-100'} flex items-center justify-between px-3 py-2`}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <span>{newBadge.color || 'Seleziona Colore'}</span>
                  <span className="material-icons">arrow_drop_down</span>
                </div>
                {showColorPicker && (
                  <ColorPicker 
                    selectedColor={newBadge.color} 
                    onSelectColor={(color) => {
                      setNewBadge({ ...newBadge, color });
                      setShowColorPicker(false);
                    }}
                  />
                )}
              </div>

              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Crea Badge
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Badge Esistenti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {badges.map((badge) => (
                <div key={badge.id} onClick={() => handleOpenEditModal(badge)} className="cursor-pointer">
                  <BadgePatch badge={badge} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <EditBadgeModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModal(false)}
        onUpdate={handleUpdateBadge}
        onDelete={handleOpenDeleteModal}
        badge={selectedBadge}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModal(false)}
        onConfirm={handleDeleteBadge}
        title="Conferma Eliminazione Badge"
        message="Sei sicuro di voler eliminare questo badge? Verrà rimosso da tutti gli studenti che lo possiedono. L'azione è irreversibile."
      />
    </div>
  );
}