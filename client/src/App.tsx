import { Routes, Route, Link, Outlet, useNavigate  } from "react-router-dom";
import Home from './components/Home'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="poker/:pokerId" element={<Poker />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}



function Poker() {
  return (
    <div>
      <h2>Poker</h2>
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



