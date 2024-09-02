import React, { useState, useEffect } from 'react';
import { translation } from '../../types/types';
import NavbarComponent from '../Navbar/NavbarComponent';
import {Container, Row, Col, Button, InputGroup, Form, Card, Modal } from 'react-bootstrap';
import './GetTranslations.css';

const GetTranslations = () => {
    const [translations, setTranslations] = useState<translation[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [ showModal, setShowModal ] = useState<boolean>(false); 
    const [ selectedTranslationKey, setSelectedTranslationKey ] = useState<string | null>(null);
    
    const loadUserId = () => {
        return localStorage.getItem('userId')
      }

    const userId = loadUserId();

    //console.log(userId);

    useEffect(() => {
        if (userId) {
            
            getTranslations(userId);
        }else{
            alert('Please login to see the saved translations')
        }
    }, [userId]);

    const getTranslations = async (userId: string) => {
        if (!userId) {
            console.error('UserId is empty. Cannot fetch translations.');
            alert('Please login to see your saved translations');
            return;
        }

        try {
            const response = await fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/getSavedTranslations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {userId:userId} ),
            });

            const data = await response.json();
            // console.log(data);

            if (Array.isArray(data)) {
                setTranslations(data);
            } else {
                console.error('Unexpected response format:', data);
                setTranslations([]); // Ensure translations is always an array
            }
        } catch (error) {
            console.error('Error fetching translations:', error);
            setTranslations([]); // Set to empty array on error
        }
    };

    const handleToggleTranslations = () => {
        if (translations.length > 0) {
            setTranslations([]);
            setSearchTerm('');
        } else if (userId) {
            getTranslations(userId);
        }
    };

    const handleDeleteClick = (translationKey: string) => {
        setSelectedTranslationKey(translationKey);
        setShowModal(true);
    }

    const handleConfirmDelete = async() => {
        if(userId && selectedTranslationKey){
            try{
                const response = await fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/deleteTranslations', {
                    method: 'POST',
                    headers: {
                        'Content-type' : 'application/json',
                    },
                    body: JSON.stringify({userId: userId, translationKey: selectedTranslationKey})
                });
                if(response.ok){
                    setTranslations(translations.filter((t) => t.TranslationKey !== selectedTranslationKey));
                    alert ('Translation deleted successfully')
                }else{
                    alert('Failed to delete translation')
                }
            }
            catch(error){
                console.error('Error deleting translation', error)
                alert('An error occured while deleting translation')
            }
        }
        setShowModal(false);
        setSelectedTranslationKey(null);
    }

    const handleCancelDelete = () => {
        setShowModal(false);
        setSelectedTranslationKey(null);
    }

    const filteredTranslations = translations.filter(t => 
        t.Text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.Translation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <NavbarComponent />
            <Container style={{marginTop: '100px'}}>
               
                    {userId && (
                        <>
                    <Row className='d-flex  justify-content-center mt-4'>
                       <Col className='d-flex justify-content-center'> 
                            <Button variant='primary' onClick={handleToggleTranslations}>
                            {translations.length > 0 ? 'Hide translations' : 'See the saved translations'}
                            </Button>
                        </Col>
                    </Row>    
                    
            {translations && translations.length > 0 && (
                <div>
                    <Row className='d-flex  justify-content-center mt-4'>
                    <Col className='d-flex justify-content-center'> 
                            <InputGroup>
                            <Form.Control
                                type='text'
                                value={searchTerm}
                                placeholder='Search your saved translations'
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />    
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row className='d-flex mt-4'>
                     
                    {/* <ul> */}
                        {filteredTranslations.length > 0 ? (
                            filteredTranslations.map((t, i) => (
                                <Col md={6} lg={4} className='mb-4' key={i}>
                                    {/* {t.Text} : {t.Translation} */}
                                    <Card className='card'>
                                        <Card.Body>
                                            <Card.Title>{t.Text}</Card.Title>
                                            <Card.Text>{t.Translation}</Card.Text>
                                            <div className="d-flex justify-content-center mt-3">
                                            <Button
                                              variant='danger'
                                              onClick={() => handleDeleteClick(t.TranslationKey)}>
                                                Delete
                                              </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <li>No translations found.</li>
                        )}
                    {/* </ul> */}
                    </Row>
                </div>
            )}
            </>

            )}
            </Container>

            <Modal show={showModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this translation?</Modal.Body>
                <Modal.Footer>
                    <Button
                      variant='secondary' 
                      onClick={handleCancelDelete}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant='danger'
                        onClick={handleConfirmDelete}
                        >
                          Delete
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default GetTranslations;
