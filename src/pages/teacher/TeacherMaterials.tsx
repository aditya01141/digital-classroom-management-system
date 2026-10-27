import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  FileText,
  Presentation,
  Image as ImageIcon,
  Video,
  FileCode,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { StudyMaterial, ContentType } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const TeacherMaterials: React.FC = () => {
  const { materials, classrooms, activeClassroom, addMaterial, togglePublishMaterial } = useClassroom();
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassroom?.id || 'cls_se_301');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ContentType>('NOTE');
  const [contentBody, setContentBody] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [sequenceOrder, setSequenceOrder] = useState<number>(materials.length + 1);

  const filteredMaterials = materials.filter((m) => {
    const matchClass = selectedClassId === 'ALL' || m.classroomId === selectedClassId;
    const matchType = typeFilter === 'ALL' || m.type === typeFilter;
    return matchClass && matchType;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMaterial({
      classroomId: selectedClassId === 'ALL' ? (activeClassroom?.id || 'cls_se_301') : selectedClassId,
      title: title.trim(),
      description: description.trim(),
      type,
      contentBody: type === 'NOTE' ? contentBody : undefined,
      fileUrl: type !== 'NOTE' ? (fileUrl || 'https://example.com/demo_resource.pdf') : undefined,
      fileSize: '2.5 MB',
      isPublished: true,
      sequenceOrder: Number(sequenceOrder) || 1,
    });

    setTitle('');
    setDescription('');
    setContentBody('');
    setFileUrl('');
    setIsModalOpen(false);
  };

  const getIconForType = (contentType: ContentType) => {
    switch (contentType) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Learning Materials Repository</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize lecture notes, slide decks, architectural blueprints, and sequential prerequisites.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-700">Filter Classroom:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden"
          >
            <option value="ALL">All Enrolled Classrooms</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
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

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              mat.isPublished ? 'border-slate-200 shadow-xs hover:shadow-md' : 'border-slate-200 bg-slate-50/70 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-100">{getIconForType(mat.type)}</div>
                  <span className="text-xs font-bold text-slate-500 uppercase">{mat.type}</span>
                </div>
                <Badge variant={mat.isPublished ? 'success' : 'slate'} size="sm">
                  {mat.isPublished ? 'Published' : 'Draft / Hidden'}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{mat.title}</h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3">{mat.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Seq Step #{mat.sequenceOrder}</span>
                <span>{mat.fileSize || 'Text Note'}</span>
                <span>{mat.uploadedAt}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setPreviewMaterial(mat)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => togglePublishMaterial(mat.id)}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  mat.isPublished
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
                title={mat.isPublished ? 'Hide from students' : 'Make visible to students'}
              >
                {mat.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Material */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Learning Material"
        subtitle="Upload notes, presentations, or diagrams to be shared with connected students."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Resource Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Lecture 05: Behavioral UML Sequence Flows"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="NOTE">Rich Text / Study Note</option>
                <option value="PRESENTATION">Slide Deck (PDF/PPT)</option>
                <option value="IMAGE">Architectural Diagram / Image</option>
                <option value="PDF">Academic Document / PDF</option>
                <option value="LINK">External Resource Link</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sequence Order</label>
              <input
                type="number"
                min={1}
                value={sequenceOrder}
                onChange={(e) => setSequenceOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description</label>
            <textarea
              rows={2}
              placeholder="What will students learn from this content?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {type === 'NOTE' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Study Note Content (Markdown)</label>
              <textarea
                rows={5}
                placeholder="Write educational notes, key concepts, bullet points, or code snippets..."
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">File / Document URL</label>
              <input
                type="url"
                placeholder="https://example.com/slides/lecture-deck.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          )}

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
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Save & Publish
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Preview Content */}
      <Modal
        isOpen={Boolean(previewMaterial)}
        onClose={() => setPreviewMaterial(null)}
        title={previewMaterial?.title || 'Study Material Preview'}
        subtitle={`Category: ${previewMaterial?.type} • Sequence Step #${previewMaterial?.sequenceOrder}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">{previewMaterial?.description}</p>

          {previewMaterial?.contentBody ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono whitespace-pre-wrap text-slate-800 max-h-80 overflow-y-auto">
              {previewMaterial.contentBody}
            </div>
          ) : previewMaterial?.fileUrl ? (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-900">External Attached Document</p>
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
              Close Preview
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
