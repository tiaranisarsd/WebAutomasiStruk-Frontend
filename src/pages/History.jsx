import React from 'react'
import Header from '../components/Header'
import LoadingIndicator from '../components/LoadingIndicator';
import { useState, useEffect } from 'react';
import CardHistory from '../components/CardHistory';

const History = () => {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <LoadingIndicator
            animation="border"
            role="status"
            style={{ width: '5rem', height: '5rem', color: '#213448' }}
          >
            <span className="visually-hidden">Loading...</span>
          </LoadingIndicator>
        </div>
      ) : (
        <>
        <Header />
        <CardHistory />
        </>
      )}
    </React.Fragment>
  );
}

export default History