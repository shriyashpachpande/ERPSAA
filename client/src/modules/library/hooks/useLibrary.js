import { useState, useEffect } from 'react';
import axios from 'axios';

const useLibrary = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    const getBooks = async (params = {}) => {
        setLoading(true);
        try {
            const res = await axios.get('/api/library/books', { params, ...getAuthHeaders() });
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch books');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getBook = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/library/books/${id}`, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch book');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createBook = async (bookData) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/library/books', bookData, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create book');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBook = async (id, bookData) => {
        setLoading(true);
        try {
            const res = await axios.put(`/api/library/books/${id}`, bookData, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update book');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`/api/library/books/${id}`, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete book');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getCopies = async (bookId) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/library/books/${bookId}/copies`, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch copies');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addCopy = async (bookId, copyData) => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/library/books/${bookId}/copies`, copyData, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add copy');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const issueBook = async (issueData) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/library/issue', issueData, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to issue book');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const returnBook = async (returnData) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/library/return', returnData, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to return book');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getStudentBooks = async (studentId) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/library/student/${studentId}/books`, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch student books');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getIssuedBooks = async (query = '') => {
        setLoading(true);
        try {
            const res = await axios.get('/api/library/issued-books', { 
                params: { query },
                ...getAuthHeaders() 
            });
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch issued books');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getStats = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/library/stats', getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch statistics');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Phase 2: Fines
    const getFines = async (studentId) => {
        setLoading(true);
        try {
            const url = studentId ? `/api/library/fines/student/${studentId}` : '/api/library/fines';
            const res = await axios.get(url, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch fines');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const collectFine = async (fineId, amount, notes) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/library/fines/collect', { fineId, amount, notes }, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to collect fine');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const waiveFine = async (waiveData) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/library/fines/waive', waiveData, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to waive fine');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Phase 2: Policies
    const getActivePolicy = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/library/policies/active', getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch policy');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPolicies = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/library/policies', getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch policies');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePolicy = async (id, policyData) => {
        setLoading(true);
        try {
            const res = await axios.put(`/api/library/policies/${id}`, policyData, getAuthHeaders());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update policy');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getBooks,
        getBook,
        createBook,
        updateBook,
        deleteBook,
        getCopies,
        addCopy,
        issueBook,
        returnBook,
        getStudentBooks,
        getIssuedBooks,
        getStats,
        getFines,
        collectFine,
        waiveFine,
        getActivePolicy,
        getPolicies,
        updatePolicy,
        // Phase 2: Reservations
        createReservation: async (data) => {
            setLoading(true);
            try {
                const res = await axios.post('/api/library/reservations', data, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to create reservation');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        getStudentReservations: async (studentId) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/library/reservations/student/${studentId}`, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch reservations');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        getBookReservations: async (bookId) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/library/reservations/book/${bookId}`, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch book reservations');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        cancelReservation: async (id) => {
            setLoading(true);
            try {
                const res = await axios.delete(`/api/library/reservations/${id}`, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to cancel reservation');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        // Phase 2: Notifications
        getNotifications: async (studentId) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/library/notifications/student/${studentId}`, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch notifications');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        markNotificationRead: async (id) => {
            setLoading(true);
            try {
                const res = await axios.post(`/api/library/notifications/${id}/read`, {}, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to mark notification as read');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        triggerReminders: async () => {
            setLoading(true);
            try {
                const res = await axios.post('/api/library/notifications/trigger-reminders', {}, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to trigger reminders');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        // Phase 2: Lost/Damaged
        markLost: async (copyId, data) => {
            setLoading(true);
            try {
                const res = await axios.post(`/api/library/copies/${copyId}/mark-lost`, data, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to mark as lost');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        markDamaged: async (copyId, data) => {
            setLoading(true);
            try {
                const res = await axios.post(`/api/library/copies/${copyId}/mark-damaged`, data, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to mark as damaged');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        // Phase 2: Book Requests
        createBookRequest: async (data) => {
            setLoading(true);
            try {
                const res = await axios.post('/api/library/book-requests', data, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to create book request');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        getStudentBookRequests: async (studentId) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/library/book-requests/student/${studentId}`, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch student requests');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        getAllBookRequests: async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/library/book-requests', getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch all requests');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        reviewBookRequest: async (id, data) => {
            setLoading(true);
            try {
                const res = await axios.put(`/api/library/book-requests/${id}/review`, data, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to review request');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        // Phase 2: Analytics
        getAdvancedAnalytics: async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/library/analytics/advanced', getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch analytics');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        // Phase 2: Audit Logs
        getAuditLogs: async (params) => {
            setLoading(true);
            try {
                const res = await axios.get('/api/library/audit-logs', { params, ...getAuthHeaders() });
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch audit logs');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        // Phase 2: Issue Requests (Borrow Requests)
        createIssueRequest: async (data) => {
            setLoading(true);
            try {
                const res = await axios.post('/api/library/issue-requests', data, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to submit request');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        getStudentIssueRequests: async (studentId) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/library/issue-requests/student/${studentId}`, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch student requests');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        getAllIssueRequests: async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/library/issue-requests', getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch all requests');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        reviewIssueRequest: async (id, data) => {
            setLoading(true);
            try {
                const res = await axios.put(`/api/library/issue-requests/${id}/review`, data, getAuthHeaders());
                return res.data;
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to review request');
                throw err;
            } finally {
                setLoading(false);
            }
        }
    };
};

export default useLibrary;
