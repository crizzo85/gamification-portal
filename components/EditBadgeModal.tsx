import React, { useState, useEffect } from 'react';
import { Badge } from './types';
import ColorPicker from './ColorPicker';
import IconPicker from './IconPicker';
import SvgIcon from './SvgIcon';
import StarSelector from './StarSelector';

interface EditBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedBadge: Badge) => void;
  onDelete: (badgeId: string) => void;
  badge: Badge | null;
}

const EditBadgeModal: React.FC<EditBadgeModalProps> = ({ isOpen, onClose, onUpdate, onDelete, badge }) => {
  const [formData, setFormData] = useState<Badge | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    setFormData(badge);
  }, [badge]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onUpdate(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Modifica Badge</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome Badge" className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrizione" className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md" />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Categoria" className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stelle:</label>
            <StarSelector count={formData.stars} onSelect={(stars) => setFormData({ ...formData, stars })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Icona:</label>
            <div 
              className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-md cursor-pointer flex items-center justify-between"
              onClick={() => setShowIconPicker(!showIconPicker)}
            >
              {formData.icon ? (
                <SvgIcon name={formData.icon} className="w-6 h-6 text-gray-700" />
              ) : (
                <span>Seleziona Icona</span>
              )}
              <span className="material-icons">arrow_drop_down</span>
            </div>
            {showIconPicker && (
              <IconPicker 
                selectedIcon={formData.icon} 
                onSelectIcon={(icon) => {
                  setFormData({ ...formData, icon });
                  setShowIconPicker(false);
                }}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Colore:</label>
            <div 
              className={`w-full h-10 rounded-md cursor-pointer ${formData.color ? `bg-${formData.color}` : 'bg-gray-100'} flex items-center justify-between px-3 py-2`}
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <span>{formData.color || 'Seleziona Colore'}</span>
              <span className="material-icons">arrow_drop_down</span>
            </div>
            {showColorPicker && (
              <ColorPicker 
                selectedColor={formData.color} 
                onSelectColor={(color) => {
                  setFormData({ ...formData, color });
                  setShowColorPicker(false);
                }}
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button 
              type="button"
              onClick={() => onDelete(formData.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Elimina
            </button>
            <div className="space-x-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annulla</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salva Modifiche</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBadgeModal;