import React, { useState } from 'react';
import {
  CalendarCheck,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { Badge } from '../../components/common/Badge';

export const TeacherAttendance: React.FC = () => {
  const { attendance, classrooms, activeClassroom, markManualAttendance, exportAttendanceCSV } = useClassroom();
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassroom?.id || 'cls_se_301');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendance = attendance.filter((a) => {
    const matchClass = selectedClassId === 'ALL' || a.classroomId === selectedClassId;
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchSearch =
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchStatus && matchSearch;
  });

  const totalRecords = filteredAttendance.length;
  const presentCount = filteredAttendance.filter((a) => a.status === 'present').length;
  const lateCount = filteredAttendance.filter((a) => a.status === 'late').length;
  const absentCount = filteredAttendance.filter((a) => a.status === 'absent').length;
  const verifiedCount = filteredAttendance.filter((a) => a.verified).length;
  const attendanceRate = totalRecords > 0 ? Math.round(((presentCount + lateCount) / totalRecords) * 100) : 0;

  const handleStatusChange = (
    rec: (typeof attendance)[0],
    newStatus: 'present' | 'absent' | 'late'
  ) => {
    markManualAttendance(rec.classroomId, rec.studentId, rec.studentName, rec.rollNumber, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verified Attendance Roster</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated attendance records authenticated by the Identity & Device Verification Service.
          </p>
        </div>

        <button
          onClick={() => exportAttendanceCSV(selectedClassId === 'ALL' ? undefined : selectedClassId)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Attendance CSV</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-slate-400">Present Rate</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{attendanceRate}%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{presentCount} Verified Present</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-slate-400">Late Arrivals</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{lateCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Recorded past 10:15 AM</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-slate-400">Absent</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{absentCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Unrecorded check-in</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-slate-400">Hardware Validated</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{verifiedCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Device Fingerprint OK</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or roll number..."
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
            <option value="ALL">All Classrooms</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'present', 'late', 'absent'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Verification Check</th>
                <th className="py-3.5 px-4">Device Fingerprint</th>
                <th className="py-3.5 px-4">Attendance Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{rec.studentName}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{rec.rollNumber}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {rec.date} • <span className="font-semibold">{rec.timestamp}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{rec.verificationMethod}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {rec.deviceFingerprint}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          rec.status === 'present'
                            ? 'success'
                            : rec.status === 'late'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {rec.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStatusChange(rec, 'present')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            rec.status === 'present'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Mark Present"
                        >
                          P
                        </button>
                        <button
                          onClick={() => handleStatusChange(rec, 'late')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            rec.status === 'late'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Mark Late"
                        >
                          L
                        </button>
                        <button
                          onClick={() => handleStatusChange(rec, 'absent')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            rec.status === 'absent'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Mark Absent"
                        >
                          A
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
