import { useNavigate, Outlet } from "react-router-dom";
import { PokerService } from '../../service/poker'
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ConstructionOutlined } from "@mui/icons-material";

function Home() {
    const navigate = useNavigate();
    const handlerCreatePoker = async () => {
        PokerService
            .create()
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

