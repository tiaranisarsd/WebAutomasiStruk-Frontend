import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaTrash } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';

const CardHistory = () => {
  const [history, setHistoryAdmin] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [historyToDelete, setHistoryAdminToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (historyId) => {
    setHistoryAdminToDelete(historyId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/master-transaction-history/${historyToDelete}`);
      setShowDeleteModal(false);
      setToastMessage('History berhasil dihapus!');
      setToastVariant('success');
      setShowToast(true);
      getHistoryAdmin();
    } catch (err) {
      console.error('Error deleting history:', err);
      setToastMessage(err.message || "Terjadi kesalahan saat menghapus data.");
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsDeleting(false);
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
        
      <Modal className='text-blue' show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header className='bg-light2' closeButton>
          <Modal.Title className='fw-bold h3'>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus history ini?
        </Modal.Body>
        <Modal.Footer className='border-0 mt-0'>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}> 
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}> 
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {' '}Loading...
              </>
            ) : (
              'Hapus'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mt-5 pt-5 text-blue fw-bold">Riwayat</h2>
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
        <Table striped bordered hover responsive className='text-center'>
          <thead className='custom-table'>
              <tr>
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
              {history.map((history, index) => (
                <tr key={history.id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(history.updated_at)}</td>
                  <td>{history.reference_no}</td>
                  <td>{history.customer_name}</td>
                  <td>{history.product_name}</td>
                  <td>{history.quantity}</td>
                  <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(history.id)}
                          className='me-2 mt-1 mb-lg-1'
                        >
                          <FaTrash />
                        </Button>
                  </td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan={12} className='text-center'>
                    Data Kosong
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          )}
      </div>
    </Container>
  );
};

export default CardHistory;
