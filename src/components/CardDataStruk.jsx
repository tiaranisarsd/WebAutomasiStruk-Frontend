import React, { useEffect, useState } from "react";
import { Card, Container, Table, Form, Button } from "react-bootstrap";
import LoadingIndicator from "./LoadingIndicator";

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

  const fetchData = async (p = page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(limit));
      if (batchId) params.set("batchId", batchId);

      const res = await fetch(`${API_BASE}/master-transaction?${params.toString()}`, {
        credentials: "include",
      });
      const json = await res.json();

      setRows(json.data || []);
      setTotalPages(json?.meta?.totalPages || 1);
      setPage(json?.meta?.page || p);
    } catch (e) {
      console.error(e);
      alert("Gagal load Data Struk. Cek console & backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // 1) buka halaman print-view (HTML auto print)
      window.open(`${API_BASE}/master-transaction/${row.id}/print-view`, "_blank", "noopener,noreferrer");

      // 2) tandai printed (kalau mau lebih aman, bisa pindah ke "After print" event—tapi ini versi simple)
      await fetch(`${API_BASE}/master-transaction/${row.id}/print`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      await fetchData(page);
    } catch (e) {
      console.error(e);
      alert("Gagal print row. Cek console/backend.");
    }
  };

  const handlePrintAllVisible = async () => {
    try {
      if (!rows.length) return;

      // WARNING: banyak popup bisa diblok browser.
      // Kalau batch besar, lebih bagus print server-side jadi PDF.
      rows.forEach((r) => {
        window.open(`${API_BASE}/master-transaction/${r.id}/print-view`, "_blank", "noopener,noreferrer");
      });

      const ids = rows.map((x) => x.id);

      await fetch(`${API_BASE}/master-transaction/print-bulk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids }),
      });

      await fetchData(page);
      alert("Print All (tampil) ditandai sebagai printed.");
    } catch (e) {
      console.error(e);
      alert("Gagal Print All. Cek console/backend.");
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
              <Form.Label className="fw-bold">Filter Batch ID (optional)</Form.Label>
              <Form.Control
                type="number"
                placeholder="contoh: 2"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              />
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

          {/* TABLE */}
          {isLoading ? (
            <div className="d-flex align-items-center gap-2">
              <LoadingIndicator animation="border" size="sm" />
              <span>Loading data...</span>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
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
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.no}</td>
                    <td>{r.reference_no}</td>
                    <td>{String(r.transaction_date || "")}</td>
                    <td>{r.customer_name}</td>
                    <td>{r.customer_phone}</td>
                    <td>{r.status}</td>
                    <td>{r.product_name}</td>
                    <td>{r.quantity}</td>
                    <td>{r.supplier_name}</td>
                    <td>{r.id_batch}</td>
                    <td style={{ width: 120 }}>
                      <Button size="sm" onClick={() => handlePrintRow(r)}>
                        Print
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

          {/* PAGINATION */}
          <div className="d-flex justify-content-between align-items-center mt-3">
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CardDataStruk;
