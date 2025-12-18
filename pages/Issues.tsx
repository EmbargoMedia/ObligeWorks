
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ImageIcon,
  X,
  Trash2,
  CheckCircle2,
  Camera,
  AlertCircle
} from 'lucide-react';
import { MOCK_ISSUES } from '../mockData';
import { IssueStatus } from '../types';

const Issues: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const filteredIssues = MOCK_ISSUES.filter(issue => 
    issue.title.toLowerCase().includes(search.toLowerCase()) || 
    issue.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remainingSlots = 5 - selectedPhotos.length;
      // Fix: explicitly cast to File[] to ensure the 'file' in forEach is recognized as a Blob
      const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setSelectedPhotos(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
    if (event.target) event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSelectedPhotos([]);
      alert('성공적으로 접수되었습니다. 담당 디자이너가 곧 확인 후 연락드리겠습니다.');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">A/S 및 케어 티켓</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">고객님의 소중한 주얼리를 위한 사후 관리 센터입니다.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 bg-[#002366] text-white px-8 py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#001A4D] transition-all shadow-xl shadow-blue-900/10 active:scale-95"
        >
          <Plus size={20} />
          새 요청 등록하기
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="티켓 제목 또는 주문번호로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#002366]/10 transition-all text-sm font-bold"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <div key={issue.id} onClick={() => navigate(`/issues/${issue.id}`)} className="p-8 hover:bg-[#002366]/5 transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#002366] bg-blue-50 px-2.5 py-1 rounded uppercase tracking-tighter">{issue.orderNumber}</span>
                      <IssueStatusBadge status={issue.status} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#002366] transition-colors tracking-tight">{issue.title}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{issue.createdAt} 등록</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#002366] group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-100 mb-6" />
              <p className="text-slate-400 font-bold">등록된 요청 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] w-full max-w-2xl p-10 md:p-14 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">새 이슈 리포트 작성</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={28} /></button>
            </div>

            <form onSubmit={handleRegister} className="space-y-8 relative z-10">
              <input type="file" ref={galleryInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Details</label>
                <textarea 
                  rows={5}
                  placeholder="제품의 상태(스크래치, 원석 유격, 난집 헐거움 등)를 구체적으로 적어주시면 더 빠른 상담이 가능합니다."
                  className="w-full px-6 py-5 rounded-[32px] bg-slate-50 border-none outline-none focus:ring-4 focus:ring-[#002366]/5 focus:bg-white transition-all font-bold text-sm text-slate-700 leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Photos (Max 5)</label>
                  <span className="text-[10px] font-bold text-slate-300">{selectedPhotos.length} / 5</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {selectedPhotos.map((p, i) => (
                    <div key={i} className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-slate-100 relative group shadow-sm">
                      <img src={p} alt="p" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2 size={24} /></button>
                    </div>
                  ))}
                  {selectedPhotos.length < 5 && (
                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="w-24 h-24 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-[#002366]/40 hover:text-[#002366] hover:bg-slate-50 transition-all gap-1 shadow-inner">
                      <ImageIcon size={28} />
                      <span className="text-[9px] font-black uppercase">Attach</span>
                    </button>
                  )}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-[#002366] text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/20 hover:bg-[#001A4D] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]">
                {isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
              </button>
            </form>
            <AlertCircle size={300} className="absolute -right-20 -bottom-20 text-[#002366] opacity-[0.02] pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};

export const IssueStatusBadge = ({ status }: { status: IssueStatus }) => {
  const configs: Record<IssueStatus, { label: string, classes: string }> = {
    [IssueStatus.RECEIVED]: { label: '접수됨', classes: 'bg-slate-100 text-slate-600' },
    [IssueStatus.REVIEWING]: { label: '확인중', classes: 'bg-[#002366]/10 text-[#002366]' },
    [IssueStatus.SOLUTION_PROPOSED]: { label: '해결안 제시', classes: 'bg-amber-100 text-amber-700' },
    [IssueStatus.IN_PROGRESS]: { label: '진행중', classes: 'bg-[#002366] text-white shadow-lg shadow-blue-900/10' },
    [IssueStatus.RESOLVED]: { label: '완료', classes: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  };
  const config = configs[status];
  return <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-tight ${config.classes}`}>{config.label}</span>;
};

export default Issues;