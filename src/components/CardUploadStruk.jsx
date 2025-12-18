import React from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import LoadingIndicator from './LoadingIndicator'
import { FaSave } from "react-icons/fa";
import { useState } from 'react';

const CardUploadStruk = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container className='p-3'>
    <h2 className='mt-5 pt-5 text-blue fw-bold'>Upload Struk</h2>
    <div className='mt-3'>
        <Card className='custom-table'>
            <Card.Body>
                <Form className="row text-blue">
                    <Form.Group>
                        <Form.Label className='fw-bold col-12'>Upload Struk</Form.Label>
                        <Form.Control
                        type='file'
                        accept='csv'
                        required
                        />
                    </Form.Group>
                    <div className='col-12 d-flex justify-content-end'>
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
                      style={{ width: '16px', height: '16px' }} 
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

  )
}

export default CardUploadStruk