import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch,  } from '../../store/store';
import { setUser, setProfile} from '../../store/store'
import { translationRequested, translationSuccessful, translationFailed } from '../../store/store'
// import GetTranslations from '../GetTranslations/GetTranslations';
// import GameSection from '../GameSection/GameSection';
import ImageSlider from '../ImageSlider/ImageSlider';
import NavbarComponent from '../Navbar/NavbarComponent';
import './Home.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';




const Home = () => {
  const [text, setText] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>('English');
  const [sourceLanguage, setSourceLanguage] = useState<string>('German');
  const [currentTranslation, setCurrentTranslation] = useState<string>('');
  const [userId, setUserId] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.access_token);
  const profile = useSelector((state: RootState) => state.user.profile);
  const translation = useSelector((state: RootState) => state.translation.translation); 
  const status = useSelector((state: RootState) => state.translation.status);
  const error = useSelector((state: RootState) => state.translation.error);

  
  
  const saveTokenToLocalStorage = (token: string) => {
    localStorage.setItem('access_token', token);
  };

  
  const loadTokenFromLocalStorage = () => {
    return localStorage.getItem('access_token');
  };

  const saveTranslation = (translation: string) => {
    localStorage.setItem('translation', translation)
  };

  const LoadTranslation = () => {
    return localStorage.getItem('translation')
  };

  const saveUserId = (userId: string) => {
    localStorage.setItem('userId', userId)
  };

 

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(setUser(codeResponse as { access_token: string }));
      saveTokenToLocalStorage(codeResponse.access_token);
    },
    onError: (error) => console.log('Login Failed', error)
  });

  useEffect(() => {
    const token = loadTokenFromLocalStorage();
    if (token) {
      dispatch(setUser({ access_token: token }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user}`, {
        headers: {
          Authorization: `Bearer ${user}`,
          Accept: 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(setProfile(data));
          saveUserId(data.id);
          setUserId(data.id);
        })
        .catch((error) => console.log(error));
    }
  }, [user, dispatch]);

  

  const handleTranslate = () => {
    dispatch(translationRequested());
    const translationFromLocalStorage = LoadTranslation();
    if(translationFromLocalStorage && translationFromLocalStorage.toLowerCase().includes(text.toLowerCase())){
      setCurrentTranslation(translationFromLocalStorage);
      dispatch(translationSuccessful({ translation: translationFromLocalStorage }));
          
    }
    fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/translate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, text, sourceLanguage, targetLanguage })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Translation response:', data); 
        if (data.translation) {
          setCurrentTranslation(data.translation);
          dispatch(translationSuccessful({ translation: data.translation }));
          saveTranslation(data.translation);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        dispatch(translationFailed({ error: error }));
      });
  };

  const handleToggleTranslation = () => {
    const newSourceLanguage = targetLanguage;
    const newTargetLanguage = sourceLanguage;
    setSourceLanguage(newSourceLanguage);
    setTargetLanguage(newTargetLanguage);
    setText(currentTranslation);
    dispatch(translationSuccessful({ translation: text }));
  };

  const handleSaveTranslation = () => {
    fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/saveTranslation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        text,
        sourceLanguage,
        targetLanguage,
        translation
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Translation saved', data.message);
        alert('Translation saved successfully')
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // const logOut = () => {
  //   googleLogout();
  //   dispatch(clearUser());
  //   localStorage.removeItem('access_token');
  // };

  const emptyText = () => {
    setText('');
  }
  

  return (
    <>
      <NavbarComponent />
      <Container 
      // className="container-flex" 
      style={{marginTop: '100px'}}>
        {!profile && <ImageSlider />}
        {profile ? (
          <div>
            <Row className="translationDiv">
              <Col md={5}>
                <Form.Group controlId="sourceLanguage">
                  <Form.Label>From:</Form.Label>
                  <Form.Select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                  </Form.Select>

                  {/* <Form.Control
                    as="textarea"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Enter text in ${sourceLanguage}`}
                    className="mt-3"
                  />
                    <Button
                      variant="light"
                      onClick={emptyText}
                      style={{
                        border: 'none',
                        fontSize: '1rem',
                        lineHeight: '1',
                        padding: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                       &times;
                    </Button> */}
                
                <div style={{ position: 'relative' }}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={`Enter text in ${sourceLanguage}`}
                      className="mt-3"
                    />
                    <Button
                      variant="light"
                      onClick={emptyText}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        border: 'none',
                        fontSize: '1rem',
                        lineHeight: '1',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        backgroundColor: 'transparent'
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={2} className="d-flex align-items-center justify-content-center mt-4">
                <Button variant="outline-secondary" onClick={handleToggleTranslation}>
                  Swap Languages
                </Button>
              </Col>

              <Col md={5}>
                <Form.Group controlId="targetLanguage">
                  <Form.Label>To:</Form.Label>
                  <Form.Select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                  </Form.Select>

                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4 justify-content-center">
              <Button 
                variant="primary" 
                onClick={handleTranslate} 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Translating...' : 'Translate'}
              </Button>
            </Row>

            <Row className="mt-4 justify-content-center">
              <Col md={8}>
                {status === 'succeeded' && translation && (
                  <p>{translation}</p>
                )}
                {status === 'failed' && <p className="text-danger">Error: {error}</p>}
              </Col>
            </Row>

            {translation && (
              <Row className="mt-4 justify-content-center">
                <Button 
                  variant="secondary" 
                  onClick={handleSaveTranslation}
                >
                  Save
                </Button>
              </Row>
            )}
          </div>
        ) : (
          <Row className="mt-5 justify-content-center">
            <Button className='googleButton' onClick={() => login()}>Sign in with Google 🚀</Button>
          </Row>
        )}
      </Container>
    </>
  );

};

export default Home;





