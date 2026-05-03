import { useState, useMemo } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Modal, Pagination, SearchInput } from '@/components/ui';
import { mockReviews } from '@/data/mockData';
import type { Review } from '@/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={16} className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [responseModal, setResponseModal] = useState<{ open: boolean; review: Review | null }>({ open: false, review: null });
  const [responseText, setResponseText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const limit = 5;

  const filtered = useMemo(() => reviews.filter(r => {
    const matchSearch = !search || r.memberName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchSearch && matchRating;
  }), [reviews, search, ratingFilter]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';
  const totalReviews = reviews.length;
  const respondedCount = reviews.filter(r => r.response).length;

  const handleRespond = () => {
    if (!responseModal.review || !responseText.trim()) return;
    setReviews(prev => prev.map(r => r.reviewId === responseModal.review!.reviewId ? {
      ...r,
      response: { managerId: 'gm-1', responseText, respondedAt: new Date().toISOString() },
    } : r));
    setResponseModal({ open: false, review: null });
    setResponseText('');
    setSuccessMsg('Response submitted successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Reviews</h1>
        <p className="text-gray-500 mt-1">View and respond to member feedback.</p>
      </div>

      {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 text-center">
          <p className="text-4xl font-bold text-gray-900">{avgRating}</p>
          <StarRating rating={Math.round(Number(avgRating))} />
          <p className="text-sm text-gray-500 mt-1">Average Rating</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 text-center">
          <p className="text-4xl font-bold text-gray-900">{totalReviews}</p>
          <p className="text-sm text-gray-500 mt-2">Total Reviews</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 text-center">
          <p className="text-4xl font-bold text-emerald-600">{respondedCount}</p>
          <p className="text-sm text-gray-500 mt-2">Responded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-64"><SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search reviews..." /></div>
          <select value={ratingFilter} onChange={e => { setRatingFilter(Number(e.target.value)); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value={0}>All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} reviews</span>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {paged.map(review => (
          <div key={review.reviewId} className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-indigo-600 font-bold text-lg">{review.memberName.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{review.memberName}</h3>
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-400">{new Date(review.submittedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>

                {/* Manager Response */}
                {review.response ? (
                  <div className="mt-4 ml-4 pl-4 border-l-2 border-indigo-200">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={14} className="text-indigo-500" />
                      <span className="text-xs font-semibold text-indigo-600">Manager Response</span>
                      <span className="text-xs text-gray-400">{new Date(review.response.respondedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.response.responseText}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => { setResponseModal({ open: true, review }); setResponseText(''); }}
                    className="mt-3 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <MessageSquare size={14} /> Respond to Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {paged.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center text-gray-500">No reviews found.</div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Response Modal */}
      <Modal isOpen={responseModal.open} onClose={() => setResponseModal({ open: false, review: null })} title="Respond to Review" size="md">
        {responseModal.review && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{responseModal.review.memberName}</span>
                <StarRating rating={responseModal.review.rating} />
              </div>
              <p className="text-sm text-gray-600">{responseModal.review.comment}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Write your response to this review..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setResponseModal({ open: false, review: null })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleRespond} disabled={!responseText.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">Submit Response</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
