import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, comment });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Submit Feedback</h3>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <p className="text-sm font-medium text-slate-600 mb-4 text-center">How satisfied are you with the resolution?</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-all transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                >
                                    <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">Additional Comments (Optional)</label>
                    <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all min-h-[100px]"
                        placeholder="Tell us about your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full mt-6 py-3 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 shadow-xl shadow-amber-100 transition-all active:scale-95"
                    >
                        Submit Feedback & Close Ticket
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
