import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaUndo } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

DataTable.use(DT);

const CardHistory = () => {
  const [history, setHistoryAdmin] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [selectedId, setSelectedId] = useState(null);
  const [isProcessing, setisProcessing] = useState(false);

  useEffect(() => {
    getHistoryAdmin();
  }, []);

  const getHistoryAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/master-transaction-history`);
      setHistoryAdmin(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message || "Terjadi kesalahan saat memuat data history.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnprintClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmUnprint = async () => {
    setisProcessing(true);
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/master-transaction/${selectedId}/unprinted`);
      setShowModal(false);
      setToastMessage('Status print dibatalkan. Data kembali ke daftar data struk');
      setToastVariant('success');
      setShowToast(true);
      getHistoryAdmin();
    } catch (err) {
      console.error('Error:', err);
      setToastMessage(err.message || "Terjadi kesalahan saat memindahkan data.");
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setisProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      day: 'numeric',
      month: 'long',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };


  return (
    <Container className="p-3">
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={2000} 
          autohide 
          bg={toastVariant}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
        
      <Modal className='text-blue' show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header className='bg-light2' closeButton>
          <Modal.Title className='fw-bold h3'>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin membatalkan status print? Data ini akan muncul kembali di menu daftar struk.
        </Modal.Body>
        <Modal.Footer className='border-0 mt-0'>
          <Button variant="secondary" onClick={() => setShowModal(false)}> 
            Batal
          </Button>
          <Button variant="warning" onClick={confirmUnprint} disabled={isProcessing}> 
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {' '}Loading...
              </>
            ) : (
              'Ya, Batalkan'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mt-5 pt-5 text-blue fw-bold">Riwayat Cetak</h2>
      <div className="mt-3">
        {loading ? (
           <div className="d-flex justify-content-center my-5">
            <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </LoadingIndicator>
          </div>
          ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <DataTable 
          options={{
            responsive: true,
            pageLength: 25,
            language: {
              search: "Search:",
              lengthMenu: "_MENU_ jumlah data/entri per halaman",
              zeroRecords: "Data Kosong",
              info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ entri",
              infoEmpty: "Menampilkan 0 sampai 0 dari 0 entri",
              infoFiltered: "(difilter dari _MAX_ total entri"
            }
          }}
          className='table custom-table table-striped table-bordered align-middle'>
            <thead>
              <tr className='text-center'>
                <th>No</th>
                <th>Terakhir di Print</th>
                <th>Reference No</th>
                <th>Customer</th>
                <th>Produk</th>
                <th>Qty</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr className='text-center' key={item.id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(item.updated_at)}</td>
                  <td>{item.reference_no}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <Button
                    variant='outline-warning'
                    size='sm'
                    className='rounded-circle shadow-sm'
                    onClick={() => handleUnprintClick(item.id)}
                    >
                      <FaUndo />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          )}
      </div>
    </Container>
  );
};

export default CardHistory;
