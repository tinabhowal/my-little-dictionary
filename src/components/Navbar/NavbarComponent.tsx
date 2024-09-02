import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch } from 'react-redux';
import { googleLogout } from '@react-oauth/google';
import { clearUser } from '../../store/store';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavbarComponent.css';

const NavbarComponent = () => {

const location = useLocation();

const navigate = useNavigate();

const dispatch = useDispatch();


const userId = localStorage.getItem('userId');

const handleLogout = () => {
  googleLogout();
  dispatch(clearUser());
  localStorage.clear();
  navigate('/');
}

  return (
    <Navbar bg='light' variant='light' expand='lg' fixed="top" className='nav shadow'>
    <Container>
      <Navbar.Brand className='navBrand' href='/'>My Little Dictionary</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
        <Nav className='ml-auto'>
          {userId ? (
            <>
            <Nav.Link href='/' className={location.pathname === '/'? 'active': ''}>Home</Nav.Link>
            <Nav.Link href='/gameSection' className={location.pathname === '/gameSection' ? 'active' : ''}>Games</Nav.Link>
            <Nav.Link href='/myWordBook' className={location.pathname === '/myWordBook'? 'active' : ''}>My word Book</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          ):(
            <>
            <Nav.Link href='/'>Home</Nav.Link>
            </>
          )}
          {/* <Nav.Link href='/'>Home</Nav.Link>
          <Nav.Link href='/gameSection'>Games</Nav.Link>
          <Nav.Link href='/myWordBook'>My word Book</Nav.Link>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link> */}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
    
  )
}

export default NavbarComponent;