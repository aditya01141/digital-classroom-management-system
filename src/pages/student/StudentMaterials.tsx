import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Presentation,
  Image as ImageIcon,
  Video,
  FileCode,
  Link as LinkIcon,
  Eye,
  CheckCircle2,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { StudyMaterial, ContentType } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const StudentMaterials: React.FC = () => {
  const { materials, classrooms, markMaterialComplete } = useClassroom();
  const { user } = useAuth();

  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const publishedMaterials = materials.filter((m) => m.isPublished);

  const filtered = publishedMaterials.filter((m) => {
    const matchClass = selectedClassId === 'ALL' || m.classroomId === selectedClassId;
    const matchType = typeFilter === 'ALL' || m.type === typeFilter;
    const matchSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchType && matchSearch;
  });

  const getIcon = (type: ContentType) => {
    switch (type) {
      case 'NOTE':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'PRESENTATION':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      case 'IMAGE':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'VIDEO':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'PDF':
        return <FileCode className="w-5 h-5 text-rose-600" />;
      case 'LINK':
        return <LinkIcon className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Published Study Materials</h1>
        <p className="text-xs text-slate-500 mt-1">
          Access lecture notes, architectural blueprints, and slide decks published by your instructors.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50 text-slate-900 focus:outline-hidden"
            />
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden"
          >
            <option value="ALL">All Enrolled Courses</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'NOTE', 'PRESENTATION', 'IMAGE', 'PDF'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                typeFilter === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((mat) => {
          const isDone = mat.completedByStudentIds?.includes(user?.id || 'usr_student_01');

          return (
            <div
              key={mat.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100">{getIcon(mat.type)}</div>
                    <span className="text-xs font-bold text-slate-500 uppercase">{mat.type}</span>
                  </div>
                  {isDone && (
                    <Badge variant="success" size="sm">
                      Completed
                    </Badge>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{mat.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3">{mat.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Step #{mat.sequenceOrder}</span>
                  <span>{mat.fileSize || 'Text'}</span>
                  <span>{mat.uploadedAt}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setPreviewMaterial(mat)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Resource</span>
                </button>

                {!isDone && (
                  <button
                    onClick={() => markMaterialComplete(mat.id, user?.id || 'usr_student_01')}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Mark activity completed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Material */}
      <Modal
        isOpen={Boolean(previewMaterial)}
        onClose={() => setPreviewMaterial(null)}
        title={previewMaterial?.title || 'Learning Content'}
        subtitle={`Step #${previewMaterial?.sequenceOrder} • Category: ${previewMaterial?.type}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">{previewMaterial?.description}</p>

          {previewMaterial?.contentBody ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono whitespace-pre-wrap text-slate-800 max-h-80 overflow-y-auto">
              {previewMaterial.contentBody}
            </div>
          ) : previewMaterial?.fileUrl ? (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-900">Attached Study Resource</p>
                <p className="text-blue-700 font-mono text-[11px] truncate max-w-sm">{previewMaterial.fileUrl}</p>
              </div>
              <a
                href={previewMaterial.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <span>Open File</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : null}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setPreviewMaterial(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
