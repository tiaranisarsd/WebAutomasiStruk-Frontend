import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Table,
  Form,
  Button,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import LoadingIndicator from "./LoadingIndicator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTrash,
  FaPrint,
  FaEdit,
} from "react-icons/fa";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

const CardDataStruk = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("success");
  const [toastHeader, setToastHeader] = useState("");
  const [toastBody, setToastBody] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(500);
  const [totalPages, setTotalPages] = useState(1);

  // filter
  const [refNo, setRefNo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

  const fetchData = async (p = page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(limit));
      if (refNo) params.set("referenceNo", refNo);
      if (statusFilter) params.set("status", statusFilter);
      if (batchFilter)  params.set("idBatch", batchFilter);

      const response = await axios.get(
        `${API_BASE}/master-transaction?${params.toString()}`,
      );

      const json = response.data;

      const rawData = Array.isArray(json) ? json : json.data || [];

      const sortedData = [...rawData].sort((a, b) => a.id - b.id);

      setRows(sortedData);
      setTotalPages(json?.meta?.totalPages || 1);
      setPage(json?.meta?.page || p);
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        navigate("/");
      } else {
        alert("Gagal load Data Struk. Cek console & backend");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, batchFilter]);

  const onApplyFilter = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  const onPrev = () => {
    if (page > 1) fetchData(page - 1);
  };

  const onNext = () => {
    if (page < totalPages) fetchData(page + 1);
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAllVisible = () => {
    if (selectedIds.length === rows.length) {
      setSelectedIds([]);
    } else {
      const allIds = rows.map((r) => r.id);
      setSelectedIds(allIds);
    }
  };

  const handlePrintRow = async (row) => {
    try {
      const targetId = row.id;
      window.open(
        `${API_BASE}/master-transaction/${targetId}/print-view`,
        "_blank",
        "noopener,noreferrer",
      );

      await axios.patch(`${API_BASE}/master-transaction/${targetId}/print`);

      await fetchData(page);
    } catch (e) {
      console.error(e);
      alert("Gagal print row. Cek console/backend.");
    }
  };

  const handlePrintSelected = async () => {
    try {
      if (selectedIds.length === 0) {
        return alert("Silahkan pilih data terlebih dahulu melalu checkbox");
      }

      const idString = selectedIds.join(",");
      window.open(
        `${API_BASE}/master-transaction/print-bulk-view?ids=${idString}`,
        "_blank",
      );

      await axios.patch(`${API_BASE}/master-transaction/print-bulk`, {
        ids: selectedIds,
      });

      setSelectedIds([]);
      fetchData(page);
    } catch (e) {
      console.error("Kesalahan API:", e.response?.data);
      alert("Gagal update status: " + (e.response?.data?.msg || e.message));
    }
  };

  const handlePrintAllVisible = async () => {
    try {
      const ids = rows.map((r) => Number(r.id)).filter((id) => !isNaN(id));

      if (ids.length === 0) {
        return alert("Tidak ada data untuk diprint");
      }

      console.log("Mengirim IDs ke backend:", ids);

      const idString = ids.join(",");
      window.open(
        `${API_BASE}/master-transaction/print-bulk-view?ids=${idString}`,
        "_blank",
      );

      await axios.patch(`${API_BASE}/master-transaction/print-bulk`, { ids });

      fetchData(page);
    } catch (e) {
      console.error("Kesalahan API:", e.response?.data);
      alert("Gagal update status: " + (e.response?.data?.msg || e.message));
    }
  };

  const showNotification = (variant, header, bodyContent) => {
    setToastVariant(variant);
    setToastHeader(header);
    setToastBody(bodyContent);
    setShowToast(true);
  };

  const handleDeleteClick = (dataId) => {
    setDataToDelete(dataId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/master-transaction/${dataToDelete}`,
      );
      setShowDeleteModal(false);
      showNotification("success", "Berhasil", "Data berhasil dihapus!");
      fetchData();
    } catch (err) {
      console.error("Error deleting Data:", err);
      showNotification(
        "danger",
        "Gagal",
        err.message || "Terjadi kesalahan saat menghapus data.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueBatches = [...new Set(rows.map(item => item.id_batch))].filter(Boolean);

  return (
    <Container className="p-3">
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999, position: "fixed" }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={8000}
          autohide
          bg={toastVariant.toLowerCase()}
        >
          <Toast.Header>
            {toastVariant === "success" && (
              <FaCheckCircle className="me-2 text-success" />
            )}
            {toastVariant === "warning" && (
              <FaExclamationTriangle className="me-2 text-warning" />
            )}
            {toastVariant === "danger" && (
              <FaTimesCircle className="me-2 text-danger" />
            )}

            <strong className="me-auto">{toastHeader}</strong>
            <small>Baru saja</small>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "light" ? "text-dark" : "bg-white"}
          >
            {toastBody}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal
        className="text-blue"
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header className="bg-light2" closeButton>
          <Modal.Title className="fw-bold h3">Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus data ini?</Modal.Body>
        <Modal.Footer className="border-0 mt-0">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Loading...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <h2 className="mt-5 pt-5 text-blue fw-bold">Data Resi</h2>

      <Card className="mt-3">
        <Card.Body>
          {/* FILTER */}
          <Form
            className="row g-2 align-items-end mb-3"
            onSubmit={onApplyFilter}
          >
            <Form.Group className="col-md-3">
              <Form.Label className="fw-bold text-blue">
                Filter Reference No
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="INV251230699999999"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label className="fw-bold text-blue">Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Kadaluarsa">Kadaluarsa</option>
                <option value="Sudah dibayar">Sudah dibayar</option>
                <option value="Dikirim">Dikirim</option>
                <option value="Dikemas">Dikemas</option>
                <option value="Barang sudah diterima">
                  Barang sudah diterima
                </option>
                <option value="Pemesanan dibatalkan">
                  Pemesanan dibatalkan
                </option>
                <option value="Selesai / Berhasil">Selesai/Berhasil</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="col-md-2">
              <Form.Label className="fw-bold text-blue">Filter Batch</Form.Label>
              <Form.Select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
                <option value="">Semua Batch</option>
                {uniqueBatches.map(b => (
                  <option key={b} value={b}>Batch {b}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="col-md-6 d-flex gap-1">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Apply"}
              </Button>

              <Button
                variant="secondary"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setRefNo("");
                  setStatusFilter("");
                  setTimeout(() => fetchData(1), 0);
                }}
              >
                Reset
              </Button>

              <Button
                variant="success"
                type="button"
                disabled={isLoading || rows.length === 0}
                onClick={handlePrintAllVisible}
              >
                Print All (tampil)
              </Button>
              <Button
                variant="success"
                disabled={selectedIds.length === 0 || isLoading}
                onClick={handlePrintSelected}
              >
                Print Terpilih ({selectedIds.length})
              </Button>
            </div>
          </Form>

          {/* PAGINATION */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              Page <b>{page}</b> / <b>{totalPages}</b>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={onPrev}
                disabled={isLoading || page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline-primary"
                onClick={onNext}
                disabled={isLoading || page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>

          {/* TABLE */}
          {isLoading ? (
            <div className="d-flex align-items-center gap-2">
              <LoadingIndicator animation="border" size="sm" />
              <span>Loading data...</span>
            </div>
          ) : (
            <Table striped bordered hover responsive className="text-center">
              <thead className="custom-table">
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={
                        rows.length > 0 && selectedIds.length === rows.length
                      }
                      onChange={handleSelectAllVisible}
                    />
                  </th>
                  <th>No</th>
                  <th>Reference No</th>
                  <th>Tanggal</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Produk</th>
                  <th>Qty</th>
                  <th>Supplier</th>
                  <th>Batch</th>
                  <th className="px-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, index) => (
                  <tr key={`${r.id}-${index}`}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => handleSelectRow(r.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{r.reference_no}</td>
                    <td>{r.transaction_date}</td>
                    <td>{r.customer_name}</td>
                    <td>{r.customer_phone}</td>
                    <td>{r.status}</td>
                    <td>{r.product_name}</td>
                    <td>{r.quantity}</td>
                    <td>{r.supplier_name}</td>
                    <td>{r.id_batch}</td>
                    <td>
                      <Button
                        size="sm"
                        className="w-75"
                        variant={r.is_print === "1" ? "secondary" : "primary"}
                        onClick={() => handlePrintRow(r)}
                      >
                        <FaPrint className="me-2" />
                        {r.is_print === "1" ? "Re-print" : "Print"}
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="w-75 mt-1 text-white"
                        onClick={() =>
                          navigate(`/data-struk/edit/${r.id}`)
                        }
                      >
                        <FaEdit color="white" /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(r.id)}
                        className="w-75 mt-1"
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={12} className="text-center">
                      Data kosong
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CardDataStruk;
