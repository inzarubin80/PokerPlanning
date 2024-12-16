import { useNavigate, Outlet } from "react-router-dom";
import { authAxios } from '../../service/http-common'; 
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { $CombinedState } from "@reduxjs/toolkit";

function Home() {
    const navigate = useNavigate();
    const handlerCreatePoker = async () => {
      
        
        console.log("publicAxios.defaults.headers", authAxios.defaults.headers)


        authAxios.post("/poker")
            .then((response) => {
                console.log(response.data)
                navigate(`/poker/${response.data}`);
            })
            .catch((e) => {

            });
    }
    return (
        <div>
            <Container maxWidth="sm" >
                <Box sx={{ my: 4, textAlign: 'center' }}>

                    <Typography variant="h4" component="h1" sx={{ mb: 2 }
                    } >
                        Покер планирования
                    </Typography>

                    < Button size="large" variant="outlined" onClick={() => handlerCreatePoker()}>
                        Создать
                    </Button>

                </Box>
            </Container>

            < Outlet />
        </div>

    );
}

export default Home;

