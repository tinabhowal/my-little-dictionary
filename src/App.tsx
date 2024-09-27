// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from './store/store';
// import { setUser, setProfile, clearUser } from './store/store';
// import { translationRequested, translationSuccessful, translationFailed } from './store/store'; 
// import GetTranslations from './components/GetTranslations/GetTranslations';
// import GameSection from './components/GameSection/GameSection';
// import ImageSlider from './components/ImageSlider/ImageSlider';
// import NavbarComponent from './components/Navbar/NavbarComponent';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// const App = () => {
//   const [text, setText] = useState<string>('');
//   const [targetLanguage, setTargetLanguage] = useState<string>('English');
//   const [sourceLanguage, setSourceLanguage] = useState<string>('German');
//   const [currentTranslation, setCurrentTranslation] = useState<string>('');
//   const [userId, setUserId] = useState<string>('');
//   const dispatch = useDispatch<AppDispatch>();
//   const user = useSelector((state: RootState) => state.user.access_token);
//   const profile = useSelector((state: RootState) => state.user.profile);
//   const translation = useSelector((state: RootState) => state.translation.translation); 
//   const status = useSelector((state: RootState) => state.translation.status);
//   const error = useSelector((state: RootState) => state.translation.error);

  
//   const saveTokenToLocalStorage = (token: string) => {
//     localStorage.setItem('access_token', token);
//   };

  
//   const loadTokenFromLocalStorage = () => {
//     return localStorage.getItem('access_token');
//   };

//   const login = useGoogleLogin({
//     onSuccess: (codeResponse) => {
//       dispatch(setUser(codeResponse as { access_token: string }));
//       saveTokenToLocalStorage(codeResponse.access_token);
//     },
//     onError: (error) => console.log('Login Failed', error)
//   });

//   useEffect(() => {
//     const token = loadTokenFromLocalStorage();
//     if (token) {
//       dispatch(setUser({ access_token: token }));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (user) {
//       fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user}`, {
//         headers: {
//           Authorization: `Bearer ${user}`,
//           Accept: 'application/json'
//         }
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           dispatch(setProfile(data));
//           setUserId(data.id);
//         })
//         .catch((error) => console.log(error));
//     }
//   }, [user, dispatch]);

//   const handleTranslate = () => {
//     dispatch(translationRequested());
//     fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/translate', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${user}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ userId, text, sourceLanguage, targetLanguage })
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('Translation response:', data); 
//         if (data.translation) {
//           setCurrentTranslation(data.translation);
//           dispatch(translationSuccessful({ translation: data.translation }));
//         } else {
//           console.error('Unexpected response format:', data);
//         }
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         dispatch(translationFailed({ error: error }));
//       });
//   };

//   const handleToggleTranslation = () => {
//     const newSourceLanguage = targetLanguage;
//     const newTargetLanguage = sourceLanguage;
//     setSourceLanguage(newSourceLanguage);
//     setTargetLanguage(newTargetLanguage);
//     setText(currentTranslation);
//     dispatch(translationSuccessful({ translation: text }));
//   };

//   const handleSaveTranslation = () => {
//     fetch('https://suwg4eyhsj.execute-api.ap-south-1.amazonaws.com/saveTranslation', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${user}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         userId,
//         text,
//         sourceLanguage,
//         targetLanguage,
//         translation
//       })
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('Translation saved', data.message);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   };

//   const logOut = () => {
//     googleLogout();
//     dispatch(clearUser());
//     localStorage.removeItem('access_token');
//   };

//   return (
//     <div>
//       <h2 className='appHeading'>My Little Dictionary</h2>
//       {!profile && (<ImageSlider />)}
//       {profile ? (
//         <div>
//           <div>
//             <img src={profile.picture} alt='profile' />
//             <p>Welcome {profile.name}!</p>
//             {/* <p>Email Address: {profile.email}</p> */}
//           </div>
//           <div className='translationDiv'>

//             <div className='translateFrom'>
//             <label htmlFor='sourceLanguage'>From:</label>
//             <select 
//             className='sourceLanguage'
//             value={sourceLanguage}
//             onChange={(e) => setSourceLanguage(e.target.value)}
//             >
//               <option value='English'>English</option>
//               <option value='German'>German</option>
//               <option value='French'>French</option>
//               <option value='Spanish'>Spanish</option>
//             </select>

//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder={`Enter text in ${sourceLanguage}`}
//             />
//             </div>

//             <button className='toggleButton' onClick={handleToggleTranslation}>Toggle</button>
            
//             <div className='translatedTo'>
//               <label htmlFor='targetLanguage'>To:</label>
//               <select
//                 className='targetLanguage'
//                 value={targetLanguage}
//                 onChange={(e) => setTargetLanguage(e.target.value)}
//               >
//                 <option value='English'>English</option>
//                 <option value='German'>German</option>
//                 <option value='French'>French</option>
//                 <option value='Spanish'>Spanish</option>
//               </select>
              
//             </div>

//            <div className='translationButtonAndTranslation'>
//             <button onClick={handleTranslate} disabled={status === 'loading'}>
//               {status === 'loading' ? 'Translating' : 'Translate'}
//             </button>


          

//             </div>


//           </div>

//           <div className="translationReceived">
//             {status === 'succeeded' && translation && typeof translation === 'string' && (
//               <p>{translation}</p>
//             )}
//             {status === 'failed' && <p>Error: {error}</p>}
//             </div>


//           <div className='saveTranslation'>
//             <button onClick={handleSaveTranslation}>Save</button>
//           </div>
//           <div className='gamesDiv'><GameSection /></div>
//           <div className='getSavedTranslations'><GetTranslations /></div>
//           <button onClick={logOut}>Log out</button>
//         </div>
//       ) : (
//         <div>
//           <button onClick={() => login()}>Sign in with Google 🚀</button>
//         </div>
//       )}
//     </div>
//   );


// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import GameSection from './components/GameSection/GameSection';
import GetTranslations from './components/GetTranslations/GetTranslations';
import './App.css';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/gameSection' element={<GameSection />} />
        <Route path='/myWordBook' element={<GetTranslations />} />
        <Route path='/privacyPolicy' element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  )
}

export default App

