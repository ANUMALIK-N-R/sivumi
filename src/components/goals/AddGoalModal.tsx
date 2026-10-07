import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoalCategory } from '../../types/database';
import { X } from 'lucide-react';

interface AddGoalModalProps {
  onClose: () => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ onClose }) => {
  const { addGoal } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('health');
  const [targetCount, setTargetCount] = useState(1);
  const [targetUnit, setTargetUnit] = useState('times');

  const categories: { id: GoalCategory; label: string }[] = [
    { id: 'health', label: 'Health' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'food', label: 'Food' },
    { id: 'movement', label: 'Movement' },
    { id: 'study', label: 'Study' },
    { id: 'personal', label: 'Personal' },
    { id: 'emotional', label: 'Wellbeing' }
  ];

  const handleSave = () => {
    if (!title.trim()) return;

    addGoal({
      title: title.trim(),
      category,
      frequency: 'daily',
      targetCount: Math.max(1, targetCount),
      targetUnit: targetUnit.trim() || 'times',
      iconName: 'Check'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden border border-[#EFEAE6]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#EFEAE6] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
              New Habit
            </h3>
            <p className="text-[11px] text-[#7A6C74]">A gentle daily intention</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-400 hover:text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left font-sans">
          {/* Title */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Habit Name
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 15-minute gentle walk or drink spearmint tea"
              className="w-full bg-white border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    category === c.id
                      ? 'bg-[#2C2428] text-white border-[#2C2428]'
                      : 'bg-white text-[#7A6C74] border-[#EAE3DE] hover:border-stone-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <div>
              <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                Target Count
              </label>
              <input
                type="number"
                min="1"
                value={targetCount}
                onChange={e => setTargetCount(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs font-semibold text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                Unit
              </label>
              <input
                type="text"
                value={targetUnit}
                onChange={e => setTargetUnit(e.target.value)}
                placeholder="times / mins / glasses"
                className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EFEAE6] flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6C74] hover:bg-[#FAF8F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-5 py-2 rounded-xl bg-[#2C2428] hover:bg-black text-white text-xs font-semibold shadow-xs active:scale-95 transition-all disabled:opacity-40"
          >
            Create Habit
          </button>
        </div>
      </div>
    </div>
  );
};
