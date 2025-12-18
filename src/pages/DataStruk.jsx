import React from 'react'
import Header from '../components/Header'
import LoadingIndicator from '../components/LoadingIndicator'
import { useState, useEffect } from 'react'
import CardDataStruk from '../components/CardDataStruk'

const DataStruk = () => {
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
            <div className='d-flex justify-content-center align-items-center' style={{minHeight: '80vh'}}>
                <LoadingIndicator />
            </div>
        ) : (
            <>
            <Header />
            <CardDataStruk />
            </>
        )}
    </React.Fragment>
  )
}

export default DataStruk