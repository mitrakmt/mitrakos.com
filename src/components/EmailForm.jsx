// app/page.js
'use client';

import { useState } from 'react';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = {
      email,
    };

    try {
      const response = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thank you for subscribing!');
        setEmail('');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="lg:pl-16" onSubmit={handleSubmit}>
      <h3 className="text-base font-medium tracking-tight dark:text-white">
        Get two free chapters straight to your inbox{' '}
        <span aria-hidden="true">&rarr;</span>
      </h3>
      <div className="mt-4 sm:relative sm:flex sm:items-center sm:py-0.5 sm:pr-2.5">
        <div className="relative sm:static sm:flex-auto">
          <input
            type="email"
            id="email-address"
            required
            aria-label="Email address"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer relative z-10 w-full appearance-none bg-transparent px-4 py-2 text-base text-white placeholder:text-white/70 focus:outline-none sm:py-3"
          />
          <div className="absolute inset-0 rounded-md border border-white/20 peer-focus:border-blue-300 peer-focus:bg-blue-500 peer-focus:ring-1 peer-focus:ring-blue-300 sm:rounded-xl" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full sm:relative sm:z-10 sm:mt-0 sm:w-auto sm:flex-none bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {loading ? 'Submitting...' : 'Get free chapters'}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
};

export default EmailForm;
