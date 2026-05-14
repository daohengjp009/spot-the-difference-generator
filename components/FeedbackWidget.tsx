'use client';

import React, { useState } from 'react';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const submitFeedback = async () => {
    if (!message.trim()) {
      setError('Please enter feedback before sending.');
      return;
    }

    try {
      setStatus('sending');
      setError('');

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous',
          message: message.trim(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send feedback');
      }

      setStatus('sent');
      setMessage('');
      setName('');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 1200);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to send feedback');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600"
        >
          Send Feedback
        </button>
      ) : (
        <div className="w-80 rounded-2xl border border-orange-100 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Quick Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What worked? What was confusing?"
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />

          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          {status === 'sent' ? <p className="mt-2 text-xs text-green-600">Thanks, feedback sent.</p> : null}

          <button
            onClick={submitFeedback}
            disabled={status === 'sending'}
            className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}
