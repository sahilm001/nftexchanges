import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Sell from './components/Sell';
import Toast from './components/Toast';
import AuthPage from './components/AuthPage';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { DUMMY_NFTS, USER_PROFILE } from './dummyData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [nfts, setNfts] = useState(DUMMY_NFTS);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('nft_user_profile');
    if (saved) {
      try {
        return { ...USER_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse profile data', e);
      }
    }
    return { ...USER_PROFILE, fullName: '', email: '', phone: '', dob: '', avatarUrl: '' };
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [theme, setTheme] = useState(() => localStorage.getItem('nft_theme') || 'dark');

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('nft_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Initialize Auth session from localStorage
  useEffect(() => {
    const session = localStorage.getItem('nft_session');
    const adminSession = localStorage.getItem('nft_admin');
    if (session) {
      setIsAuthenticated(true);
      setUserAddress(session); // Mock address restoration
    }
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const updateUserProfile = (newData) => {
    const updated = { ...userProfile, ...newData };
    setUserProfile(updated);
    localStorage.setItem('nft_user_profile', JSON.stringify(updated));
    showToast('Profile updated successfully!', 'success');
  };

  const handleLogin = (email, adminFlag = false) => {
    setIsAuthenticated(true);
    setIsAdmin(adminFlag);

    // Create a mock session
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
    setUserAddress(mockAddress);

    // Store simple flags for persistence across refresh
    localStorage.setItem('nft_session', mockAddress);
    if (adminFlag) localStorage.setItem('nft_admin', 'true');

    setToast({ show: true, message: adminFlag ? 'Logged in as Admin successfully!' : 'Logged in successfully!', type: 'success' });
    setCurrentView(adminFlag ? 'admin' : 'dashboard');
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserAddress('');
    setWalletConnected(false);
    localStorage.removeItem('nft_session');
    localStorage.removeItem('nft_admin');
    setToast({ show: true, message: 'Logged out successfully', type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const connectWallet = async (shouldConnect) => {
    if (!shouldConnect) {
      setWalletConnected(false);
      setUserAddress('');
      showToast('Wallet disconnected', 'success');
      return;
    }

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setUserProfile({ ...userProfile, address: accounts[0] });
          setWalletConnected(true);
          showToast('MetaMask connected successfully!', 'success');
        }
      } catch (error) {
        showToast(error.message || 'Connection request failed', 'error');
      }
    } else {
      setUserAddress(USER_PROFILE.address);
      setWalletConnected(true);
      showToast('MetaMask not found. Using dummy connection.', 'success');
    }
  };

  const buyNft = (nft) => {
    if (!walletConnected) {
      showToast('Please connect your wallet first!', 'error');
      return;
    }

    const priceNum = parseFloat(nft.price);
    const balanceNum = parseFloat(userProfile.balance);

    if (balanceNum < priceNum) {
      showToast('Insufficient funds!', 'error');
      return;
    }

    const updatedNfts = nfts.map(item => {
      if (item.id === nft.id) {
        return { ...item, owner: userAddress, isListed: false };
      }
      return item;
    });

    setNfts(updatedNfts);
    setUserProfile({
      ...userProfile,
      balance: (balanceNum - priceNum).toFixed(2)
    });

    showToast(`Successfully purchased ${nft.name}!`, 'success');
    setCurrentView('profile');
  };

  const addNft = (newNft) => {
    if (!walletConnected) {
      showToast('Please connect your wallet to list an NFT!', 'error');
      return;
    }
    setNfts([...nfts, newNft]);
    showToast('NFT successfully minted and listed!', 'success');
    setCurrentView('profile');
  };

  // Protected Route Logic
  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <AuthPage onLogin={handleLogin} showToast={showToast} />
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        walletConnected={walletConnected}
        connectWallet={connectWallet}
        userAddress={userAddress}
        userProfile={userProfile}
        handleLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
      />

      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard nfts={nfts} buyNft={buyNft} userAddress={userAddress} showToast={showToast} userProfile={userProfile} />}
        {currentView === 'profile' && <Profile nfts={nfts} userAddress={userAddress} userProfile={userProfile} updateUserProfile={updateUserProfile} showToast={showToast} />}
        {currentView === 'sell' && <Sell addNft={addNft} userAddress={userAddress} showToast={showToast} />}
        {currentView === 'about' && <About />}
        {currentView === 'contact' && <Contact showToast={showToast} />}
        {currentView === 'admin' && isAdmin && <AdminPanel nfts={nfts} showToast={showToast} />}
        {currentView === 'admin' && !isAdmin && <NotFound setCurrentView={setCurrentView} />}
        {!['dashboard', 'profile', 'sell', 'about', 'contact', 'admin'].includes(currentView) && <NotFound setCurrentView={setCurrentView} />}
      </main>

      <Footer setCurrentView={setCurrentView} />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default App;