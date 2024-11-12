import { Routes, Route, Link } from "react-router-dom";
import Button from '@mui/material/Button';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinkM from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';





export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}


function Home() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>

        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Покер планирования
        </Typography>
        
        <Button size="large" variant="outlined" href="#outlined-buttons">
          Создать
        </Button>

      </Box>
    </Container>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}



