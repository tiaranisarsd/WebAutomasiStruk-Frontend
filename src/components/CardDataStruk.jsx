import React, { useEffect, useState } from "react";
import { Card, Container, Table, Form, Button } from "react-bootstrap";
import LoadingIndicator from "./LoadingIndicator";
// import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

const CardDataStruk = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(500);
  const [totalPages, setTotalPages] = useState(1);

  // filter
  const [batchId, setBatchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // const { user, isError } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchData = async (p = page) => {

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(limit));
      if (batchId) params.set("batchId", batchId);
      if (statusFilter) params.set("status", statusFilter);

      const response = await axios.get(`${API_BASE}/master-transaction?${params.toString()}`);

      const json = response.data;

      const rawData = Array.isArray(json) ? json : (json.data || []);
      
      const sortedData = [...rawData].sort((a, b) => a.id - b.id);

      setRows(sortedData);
      setTotalPages(json?.meta?.totalPages || 1);
      setPage(json?.meta?.page || p);
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        navigate("/")
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
  }, [statusFilter]);

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

  const handlePrintRow = async (row) => {
    try {
      const targetId = row.id;
      window.open(`${API_BASE}/master-transaction/${targetId}/print-view`, "_blank", "noopener,noreferrer");

      await axios.patch(`${API_BASE}/master-transaction/${targetId}/print`);

      await fetchData(page);
    } catch (e) {
      console.error(e);
      alert("Gagal print row. Cek console/backend.");
    }
  };

const handlePrintAllVisible = async () => {
  try {
    const ids = rows.map((r) => Number(r.id)).filter(id => !isNaN(id));
    
    if (ids.length === 0) {
      return alert("Tidak ada data untuk diprint");
    }

    console.log("Mengirim IDs ke backend:", ids); 

    const idString = ids.join(",");
    window.open(`${API_BASE}/master-transaction/print-bulk-view?ids=${idString}`, "_blank");

    await axios.patch(`${API_BASE}/master-transaction/print-bulk`, { ids });

    fetchData(page);
    
  } catch (e) {
    console.error("Kesalahan API:", e.response?.data);
    alert("Gagal update status: " + (e.response?.data?.msg || e.message));
  }
};

  return (
    <Container className="p-3">
      <h2 className="mt-5 pt-5 text-blue fw-bold">Data Struk</h2>

      <Card className="mt-3">
        <Card.Body>
          {/* FILTER */}
          <Form className="row g-2 align-items-end mb-3" onSubmit={onApplyFilter}>
            <Form.Group className="col-md-3">
              <Form.Label className="fw-bold text-blue">Filter Batch ID (optional)</Form.Label>
              <Form.Control
                type="number"
                placeholder="contoh: 2"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
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
                <option value="Barang sudah diterima">Barang sudah diterima</option>
                <option value="Pemesanan dibatalkan">Pemesanan dibatalkan</option>
                <option value="Selesai / Berhasil">Selesai/Berhasil</option>

              </Form.Select>
            </Form.Group>

            <div className="col-md-6 d-flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Apply"}
              </Button>

              <Button
                variant="secondary"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setBatchId("");
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
            </div>
          </Form>

          {/* PAGINATION */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              Page <b>{page}</b> / <b>{totalPages}</b>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={onPrev} disabled={isLoading || page <= 1}>
                Prev
              </Button>
              <Button variant="outline-primary" onClick={onNext} disabled={isLoading || page >= totalPages}>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, index) => (
                  <tr key={`${r.id}-${index}`}>
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
                    <td style={{ width: 120 }}>
                      <Button size="sm" variant={r.is_print === "1" ? "secondary" : "primary"} onClick={() => handlePrintRow(r)}>
                        {r.is_print === "1" ? "Re-print" : "Print"}
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
