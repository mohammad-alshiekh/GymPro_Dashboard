import { useState, useMemo } from 'react';
import { ScanLine, CheckCircle, LogIn, LogOut } from 'lucide-react';
import { Pagination, SearchInput } from '@/components/ui';
import { mockAttendanceRecords, mockMembers } from '@/data/mockData';
import type { AttendanceRecord } from '@/types';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [dateFilter, setDateFilter] = useState('');
  const [memberFilter, setMemberFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [scanResult, setScanResult] = useState<AttendanceRecord | null>(null);
  const [scanning, setScanning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const limit = 8;

  const filtered = useMemo(() => records.filter(r => {
    const matchDate = !dateFilter || r.entryTime.startsWith(dateFilter);
    const matchMember = !memberFilter || r.memberId === memberFilter;
    const matchSearch = !search || r.memberName.toLowerCase().includes(search.toLowerCase());
    return matchDate && matchMember && matchSearch;
  }), [records, dateFilter, memberFilter, search]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  const todayCount = records.filter(r => r.entryTime.startsWith('2025-01-14')).length;
  const currentlyIn = records.filter(r => r.entryTime.startsWith('2025-01-14') && !r.exitTime).length;

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const randomMember = mockMembers[Math.floor(Math.random() * mockMembers.length)];
      const isEntry = Math.random() > 0.3;
      const now = new Date();

      if (isEntry) {
        const newRecord: AttendanceRecord = {
          id: `att${Date.now()}`,
          memberId: randomMember.id,
          memberName: randomMember.name,
          entryTime: now.toISOString(),
          exitTime: null,
        };
        setRecords(prev => [newRecord, ...prev]);
        setScanResult(newRecord);
        setSuccessMsg(`Entry recorded for ${randomMember.name}`);
      } else {
        // Find a member who has entry but no exit
        const openEntry = records.find(r => !r.exitTime);
        if (openEntry) {
          const updatedRecord = { ...openEntry, exitTime: now.toISOString() };
          setRecords(prev => prev.map(r => r.id === openEntry.id ? updatedRecord : r));
          setScanResult(updatedRecord);
          setSuccessMsg(`Exit recorded for ${openEntry.memberName}`);
        } else {
          const newRecord: AttendanceRecord = {
            id: `att${Date.now()}`,
            memberId: randomMember.id,
            memberName: randomMember.name,
            entryTime: now.toISOString(),
            exitTime: null,
          };
          setRecords(prev => [newRecord, ...prev]);
          setScanResult(newRecord);
          setSuccessMsg(`Entry recorded for ${randomMember.name}`);
        }
      }
      setScanning(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
        <p className="text-gray-500 mt-1">Track member check-ins and check-outs.</p>
      </div>

      {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

      {/* Summary + Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
          <p className="text-sm text-gray-500">Today's Check-ins</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{todayCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
          <p className="text-sm text-gray-500">Currently In Gym</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{currentlyIn}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 flex flex-col items-center justify-center">
          <button
            onClick={handleScan}
            disabled={scanning}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-semibold transition-all ${
              scanning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl'
            }`}
          >
            <ScanLine size={24} className={scanning ? 'animate-spin' : ''} />
            {scanning ? 'Scanning...' : 'Scan QR Code'}
          </button>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">{scanResult.memberName}</p>
              <p className="text-sm text-emerald-700">
                {scanResult.exitTime ? 'Exit' : 'Entry'} recorded at{' '}
                {new Date(scanResult.exitTime || scanResult.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-64"><SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by name..." /></div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Date:</label>
            <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <select value={memberFilter} onChange={e => { setMemberFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="">All Members</option>
            {mockMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} records</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Member</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Entry Time</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Exit Time</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(rec => {
                const duration = rec.exitTime
                  ? Math.round((new Date(rec.exitTime).getTime() - new Date(rec.entryTime).getTime()) / 60000)
                  : null;
                return (
                  <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center"><span className="text-indigo-600 font-semibold text-sm">{rec.memberName.charAt(0)}</span></div>
                        <span className="font-medium text-gray-900 text-sm">{rec.memberName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <LogIn size={14} className="text-emerald-500" />
                        {new Date(rec.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p className="text-xs text-gray-400 ml-5">{new Date(rec.entryTime).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {rec.exitTime ? (
                        <div className="flex items-center gap-1.5">
                          <LogOut size={14} className="text-red-400" />
                          {new Date(rec.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ) : (
                        <span className="text-amber-600 text-xs font-medium">Still in gym</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {duration !== null ? `${duration} min` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        rec.exitTime ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {rec.exitTime ? 'Completed' : 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 border-t border-gray-100"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </div>
    </div>
  );
}
