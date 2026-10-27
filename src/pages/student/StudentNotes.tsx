import React, { useState } from 'react';
import {
  FileSignature,
  Plus,
  Search,
  Download,
  Trash2,
  Edit2,
  Tag,
  BookOpen,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { StudentNote } from '../../types';
import { Modal } from '../../components/common/Modal';

export const StudentNotes: React.FC = () => {
  const { notes, classrooms, saveNote, deleteNote } = useClassroom();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudentNote | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [classroomId, setClassroomId] = useState(classrooms[0]?.id || 'cls_se_301');
  const [tagsInput, setTagsInput] = useState('UML, Revision');

  const studentNotes = notes.filter((n) => n.studentId === (user?.id || 'usr_student_01'));

  // Collect all unique tags
  const allTags = Array.from(new Set(studentNotes.flatMap((n) => n.tags || [])));

  const filteredNotes = studentNotes.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTag = selectedTag === 'ALL' || n.tags?.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const handleOpenCreate = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setTagsInput('Lecture Notes, Key Points');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: StudentNote) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setClassroomId(n.classroomId || classrooms[0]?.id || 'cls_se_301');
    setTagsInput(n.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const cls = classrooms.find((c) => c.id === classroomId);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    saveNote(
      {
        studentId: user?.id || 'usr_student_01',
        classroomId,
        classroomTitle: cls?.title || 'General Notes',
        title: title.trim(),
        content: content.trim(),
        tags,
      },
      editingNote?.id
    );

    setIsModalOpen(false);
  };

  const handleExportTxt = (n: StudentNote) => {
    const text = `Title: ${n.title}\nCourse: ${n.classroomTitle || 'General'}\nCreated: ${n.createdAt}\nTags: ${n.tags.join(', ')}\n\n${n.content}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${n.title.replace(/\s+/g, '_')}_Notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personal Digital Notes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture lecture takeaways, formulas, and revision summaries across all your enrolled classrooms.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Digital Note</span>
        </button>
      </div>

      {/* Search and Tags */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50 text-slate-900 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400">Tag:</span>
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
              selectedTag === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {note.classroomTitle || 'General'}
                </span>
                <span className="text-[10px] text-slate-400">{note.updatedAt}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{note.title}</h3>

              <p className="text-xs text-slate-600 mt-3 whitespace-pre-wrap font-mono bg-slate-50 p-3 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto leading-relaxed">
                {note.content}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {note.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleExportTxt(note)}
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                title="Download note as text file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.txt)</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(note)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Edit note"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create or Edit Note */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Digital Note' : 'Create New Digital Note'}
        subtitle="Saved instantly to browser storage with export support."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Note Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Design Pattern Implementation Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Associate with Classroom</label>
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden font-semibold"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="UML, Formulas, Exam"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Note Content</label>
            <textarea
              rows={6}
              required
              placeholder="Write your study notes, key terms, equations, or code snippets..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
