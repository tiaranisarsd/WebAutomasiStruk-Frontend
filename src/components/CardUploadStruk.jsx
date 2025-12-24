import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import LoadingIndicator from "./LoadingIndicator";
import { FaSave } from "react-icons/fa";

const CardUploadStruk = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Pilih file CSV dulu ya.");
      return;
    }

    // validasi sederhana
    const isCsv =
      file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      alert("File harus .csv");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      // ⚠️ Nama field "file" HARUS sama dengan backend (multer.single("file"))
      // Kalau backend pakai single("csv"), ganti jadi: formData.append("csv", file)
      formData.append("file", file);

      const res = await fetch("http://localhost:5001/upload-file", {
        method: "POST",
        headers: {
          "x-user-id": "1" // sementara
        },
        body: formData,
      });

      

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Upload error:", result);
        alert(result?.message || "Upload gagal. Cek console / backend log.");
        return;
      }

      alert(result?.message || "Upload berhasil!");
      console.log("UPLOAD RESULT:", result);
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat upload. Cek console & backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="p-3">
      <h2 className="mt-5 pt-5 text-blue fw-bold">Upload Struk</h2>
      <div className="mt-3">
        <Card className="custom-table">
          <Card.Body>
            {/* ✅ kasih onSubmit */}
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
    </Container>
  );
};

export default CardUploadStruk;
