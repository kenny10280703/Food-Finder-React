import React from 'react'
import { AppContext } from '../AppContext'
import { Box, Button, Card, CardMedia, Container, CssBaseline, Grid, Link as MUILink, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { MyContainer, MyTitle } from '../styles.js'
import { Link } from "react-router-dom";
import Footer from '../components/Footer.jsx';
import Header from '../components/Header';
import theme from '../theme.jsx';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Signup Component is a page containing a form used to register users into the system.
 *
 * @return {JSX.Element}
 * @author Kenny Yeung, Connor Cliff
 */
export default function Signup() {
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: ""
    })
    const [status, setStatus] = React.useState({
        success: false,
        message: ""
    })
    const { userObj, baseURL } = React.useContext(AppContext)
    const mainRef = React.useRef(null);
    const headerRef = React.useRef(null);

  
    React.useEffect(() => {
      const handleResize = () => {
        mainRef.current.style.minHeight = `calc(100vh - ${headerRef.current.clientHeight + document.querySelector('footer').clientHeight}px)`;
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name] : value
            }
        })
        setStatus({
            success: false,
            message: ""
        })
    }

    /**
     * Handles the submission of the signup form, sends a POST request to the server,
     * and get response from server and show corresponding error messages.
     *
     * @param {Object} event - The event object generated by the form submission
     */
    const handleSubmit = async(event) => {
        event.preventDefault()
        try {
            // Food finder is our original name, but we changed at the very late phases of our project
            const res = await fetch(`${baseURL}/food_finder/users/register`, 
            {
                headers: {
                    "Content-Type": "application/json"
                    },
                method: "POST",
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                })
            })
            if (res.status === 201) {
                toast.success("Thank you for registering with us! Please login now.")
                setStatus({
                    success: true,
                    message: ""
                })
            } else {
                const data = await res.json()
                const message = data.message
                setStatus({
                    success: false,
                    message: message
                })
            }
        } catch (error) {
            setStatus({
                success: false,
                message: "Error Communicating with server. Please try again."
            })
        }
    }

  return (
    <div>
      { userObj && <Navigate replace to="/"/> }
      { status.success && <Navigate replace to="/login"/> }
    <CssBaseline />
    <div ref={headerRef}>
     <Header />
    </div>
    <main ref={mainRef}>
    {/* Displays header image with page title */}
    <MyContainer maxWidth='sm' >
    <Card> 
        <MyTitle align='center' sx={{ top: '15vh', whiteSpace: 'nowrap' }}>
            Sign up
        </MyTitle>
        <Box sx={{ position: 'relative' }}>
            <CardMedia 
                component="img"
                sx={{ height: '30vh', filter: 'brightness(35%)' }}
                image="https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="random"
            /> 
        </Box>
    </Card>
    </MyContainer>
    <Container>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  value={formData.firstName}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  autoComplete="family-name"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={formData.username}
                  autoComplete="username"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  autoComplete="email"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  value={formData.password}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Box sx={{color: 'red'}}>{status.message}</Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MUILink component={Link} to='/login' variant="body2">
                  Already have an account? Login
                </MUILink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </Container>
    </main>
    <Footer />
    </div>
  )
}
