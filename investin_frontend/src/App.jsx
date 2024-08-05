import { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/Home/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import InvestorDetail from './components/InvestorDetails/InvestorDetail';
import Cookies from 'js-cookie';
import ForStartups from './pages/ForStartups/ForStartups.jsx';
import ForInvestors from './pages/ForInvestors/ForInvestors.jsx';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import StartupDisplay from './components/StartupShowcase/StartupDisplay';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import StartupDashboard from './components/StartupDashboard/StartupDashboard';
import AddStartup2 from './pages/AddStartup/AddStartup2';
import AllStartups from './pages/AllStartups/AllStartup';

function App() {
  const [role, setRole] = useState(Cookies.get("role"));
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLogin(true);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/forstartups' element={<ForStartups />} />
          <Route path='/investor/:investorId' element={<InvestorDetail />} />
          <Route path='/startup/:startupId' element={<StartupDisplay />} />
          <Route path='/forinvestors' element={<ForInvestors />} />
          <Route path='/resources' element={<Home />} />
          <Route path='/allStartups' element={<AllStartups/>} />

          {isLogin && role === "founder" ? (
            <>
            <Route path='/startupDashboard' element={<StartupDashboard />} />
            <Route path='/addStartup' element={<AddStartup2 />} />
            </>
          ) : (
            <Route path='*' element={<Navigate to='/home' />} />
          )}

          {isLogin ? (
            <>
              <Route path='/login' element={<Navigate to='/home' />} />
              <Route path='/register' element={<Navigate to='/home' />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </>
          )}

          <Route path='*' element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
