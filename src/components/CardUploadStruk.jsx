import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form, Toast, ToastContainer, Table, Modal, Alert } from "react-bootstrap";
import LoadingIndicator from "./LoadingIndicator";
import { FaSave, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useSelector } from 'react-redux';

const CardUploadStruk = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [batch, setBatch] = useState([]);
  const { users } = useSelector((state) => state.auth); 
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastVariant, setToastVariant] = useState("success");
  const [toastHeader, setToastHeader] = useState("");
  const [toastBody, setToastBody] = useState(null);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getBatch();
  }, []);

 const getBatch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/upload-file`);
      setBatch(response.data);
    } catch (error) {
      console.error('Error fetching batch:', error);
      setError(error.message || "Terjadi kesalahan saat memuat data batch.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (batchId) => {
    setBatchToDelete(batchId);
    setShowDeleteModal(true);
  };

    const confirmDelete = async () => {
      setIsDeleting(true);
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/upload-file/${batchToDelete}`);
        setShowDeleteModal(false);
        setShowToast('Batch berhasil dihapus!');
        setToastVariant('success');
        setShowToast(true);
        getBatch();
      } catch (err) {
        console.error('Error deleting Batch:', err);
        setShowToast(err.message || "Terjadi kesalahan saat menghapus data.");
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

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
  };

  const showNotification = (variant, header, bodyContent) => {
    setToastVariant(variant);
    setToastHeader(header);
    setToastBody(bodyContent);
    setShowToast(true);
  }

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showNotification("warning", "Perhatian", "Pilih file CSV terlebih dahulu.");
      return;
    }

    const isCsv = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      alert("File harus .csv");
      return;
    }

    try {
      setIsLoading(true);
      setShowToast(false);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5001/upload-file", {
        method: "POST",
        headers: {
          "x-user-id": "1" 
        },
        body: formData,
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Upload error:", result);
        alert(result?.message || "Upload gagal. Cek console / backend log.");
        return;
      }

      const { total_saved, total_skipped, duplicates } = result;
      
      if (total_skipped > 0) {
        showNotification(
          "warning",
          "Upload Selesai (Dengan Catatan)",
          <div>
            <p className="mb-1">
                <FaCheckCircle className="me-2 text-success"/> 
                Berhasil disimpan: <strong>{total_saved}</strong> data.
            </p>
            <p className="mb-2">
                <FaExclamationTriangle className="me-2 text-danger"/> 
                Dilewati (Duplikat): <strong>{total_skipped}</strong> data.
            </p>
            
            {duplicates && duplicates.length > 0 && (
                <div className="bg-light p-2 rounded border" style={{ fontSize: '0.85rem', maxHeight: '100px', overflowY: 'auto' }}>
                    <strong>Contoh Ref No Duplikat:</strong><br/>
                    {duplicates.slice(0, 10).join(", ")}
                    {duplicates.length > 10 && " ...dan lainnya."}
                </div>
            )}
          </div>
        );
      } else {
        showNotification(
          "success",
          "Upload Berhasil",
          <div>
             <FaCheckCircle className="me-2"/> 
             Sukses menyimpan <strong>{total_saved}</strong> data baru.
          </div>
        );
      }

      console.log("UPLOAD RESULT:", result);
      
      setFile(null);
      e.target.reset();

    } catch (err) {
      console.error(err);
      showNotification("danger", "Error Sistem", "Terjadi error saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="p-3">
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
        <Toast 
            onClose={() => setShowToast(false)} 
            show={showToast} 
            delay={8000} 
            autohide 
            bg={toastVariant.toLowerCase()}
        >
          <Toast.Header>
             {toastVariant === 'success' && <FaCheckCircle className="me-2 text-success" />}
             {toastVariant === 'warning' && <FaExclamationTriangle className="me-2 text-warning" />}
             {toastVariant === 'danger' && <FaTimesCircle className="me-2 text-danger" />}
             
            <strong className="me-auto">{toastHeader}</strong>
            <small>Baru saja</small>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'light' ? 'text-dark' : 'bg-white'}>
            {toastBody}
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

      <h2 className="mt-5 pt-5 text-blue fw-bold">Upload Struk</h2>
      <div className="mt-3">
        <Card className="custom-table">
          <Card.Body>
            <Form className="row text-blue" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className="fw-bold col-12">Upload Struk</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  required
                  onChange={handleFileChange}
                />
              </Form.Group>

              <div className="col-12 d-flex justify-content-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn mt-4"
                >
                  {isLoading ? (
                    <>
                      <LoadingIndicator
                        animation="border"
                        size="sm"
                        className="me-1 align-middle"
                        style={{ width: "12px", height: "12px" }}
                      />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="me-1" />
                      <span>Simpan</span>
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <div className="mt-3">
        {isLoading ? (
           <div className="d-flex justify-content-center my-5">
            <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </LoadingIndicator>
          </div>
          ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
        <div className="pt-4">
          <hr></hr>
          {users?.role === "admin" && (
            <>
            <h2 className="text-blue fw-bold">Data Batch</h2>
              <Table striped bordered hover responsive className="text-center mt-2">
                <thead className="custom-table">
                  <tr>
                    <th>Batch</th>
                    <th>Nama File</th>
                    <th>Di Upload Oleh</th>
                    <th>Tanggal Upload</th>
                    <th>Tindakan</th>
                  </tr>
                </thead>

                <tbody>
                  {batch.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.file_name}</td>
                      <td>{item.imported_by}</td>
                      <td>{formatDate(item.imported_at)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(item.id)}
                          className='me-2 mt-1 mb-lg-1'
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {batch.length === 0 && (
                     <tr><td colSpan={5}>Data kosong</td></tr>
                  )}
                </tbody>
              </Table>
              </>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default CardUploadStruk;