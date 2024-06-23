import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../style.css"
import TaskSearch from '../Components/TaskSearch';


function Layout() {
    let userInfo = useSelector((state) => { return state.auth.userInfo })
    const location = useLocation(); 


    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">Task Manager</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav className="mr-auto">
                                <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                                {
                                    userInfo &&
                                    <Nav.Link as={Link} to="/task">Task</Nav.Link>

                                }
                                {
                                    !userInfo &&
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                }

                            </Nav>
                            <NavDropdown title="Setting" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">
                                    {
                                        userInfo &&
                                        <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                                    }

                                </NavDropdown.Item>
                                {
                                    userInfo &&
                                    <Nav.Link as={Link} to="/changePassword">Change Password</Nav.Link>
                                }
                                <NavDropdown.Item href="#action4">
                                    {
                                        !userInfo &&
                                        <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                    }
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action5">

                                    {
                                        userInfo &&
                                        <Nav.Link as={Link} to="/task/add">Add Task</Nav.Link>
                                    }
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        {userInfo && location.pathname === "/task" && <TaskSearch />}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="outlet-container">
                <Outlet />
            </div>
            <footer className="footer text-center text-lg-start">
                <div className="text-center p-3">
                    <p>&copy; 2024 Task Manager. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default Layout;
