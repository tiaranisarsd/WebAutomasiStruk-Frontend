import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaEdit, FaTrash } from 'react-icons/fa';
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
  const [showMediaModal, setShowMediaModal] = useState(false); 
  const [selectedMedia, setSelectedMedia] = useState({ url: '', isVideo: false });

  // useEffect(() => {
  //   getHistoryAdmin();
  // }, []);

  const getHistoryAdmin = async () => {
    setLoading(true);
    // setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/history`);
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/history/${historyToDelete}`);
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

  const handleMediaClick = (mediaUrl) => {
    const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.mov');
    const fullUrl = `${process.env.REACT_APP_API_URL}${mediaUrl}`;
    setSelectedMedia({ url: fullUrl, isVideo });
    setShowMediaModal(true);
  };

  const handleCloseMediaModal = () => {
    setShowMediaModal(false);
    setSelectedMedia({ url: '', isVideo: false });
  };

  return (
    <Container className="p-3">
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
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

      <Modal show={showMediaModal} onHide={handleCloseMediaModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-blue">Dokumen</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedMedia.url ? (
            selectedMedia.isVideo ? (
              <video controls className="w-100" style={{ maxHeight: '70vh' }} onError={() => alert('Gagal memuat video.')}>
                <source src={selectedMedia.url} type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            ) : (
              <img
                src={selectedMedia.url}
                alt="History"
                className="img-fluid"
                style={{ maxHeight: '70vh', width: '100%', objectFit: 'contain' }}
                onError={() => alert('Gagal memuat dokumen.')}
              />
            )
          ) : (
            <Alert variant="warning">Tidak ada media yang tersedia untuk ditampilkan.</Alert>
          )}
        </Modal.Body>
      </Modal>

      <h2 className="mt-5 pt-5 text-blue fw-bold">Riwayat</h2>
      <div className="mt-3">
          <Table striped bordered hover responsive className='text-center'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Tanggal & Waktu</th>
                <th>Nama Invoice</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {history.map((history, index) => (
                <tr key={history.id}>
                  <td>{index + 1}</td>
                  <td>{history.tanggalWaktu}</td>
                  <td>{history.namaInvoice}</td>
                  <td>
                        <Link
                          to={`/history/edit/${history.id}`}
                          className="btn btn-sm btn-primary me-2 text-white"
                        >
                          <FaEdit />
                        </Link>
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
            </tbody>
          </Table>
      </div>
    </Container>
  );
};

export default CardHistory;
