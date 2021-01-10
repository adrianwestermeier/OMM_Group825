import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const NavigationBar = () => (
    <Navbar>
        <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/about">generator</Nav.Link></Nav.Item>
    </Navbar>
)