import React, { useState } from 'react';
import { Wallet, Store, User, PlusCircle, Menu, X, LogOut, Sun, Moon, Bell, Shield } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ currentView, setCurrentView, walletConnected, connectWallet, userAddress, userProfile, handleLogout, theme, toggleTheme, isAdmin }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const dummyNotifications = [
        { id: 1, text: "Your NFT sold!", time: "2m ago" },
        { id: 2, text: "New drop live", time: "1h ago" }
    ];

    const displayAddress = userAddress.length > 12
        ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`
        : userAddress;

    const closeMenuAndNav = (view) => {
        setCurrentView(view);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="navbar glass-panel">
            <div className="nav-brand" onClick={() => closeMenuAndNav('dashboard')}>
                <span className="gradient-text gradient-logo">NFT Galaxy</span>
            </div>

            <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <button
                    className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => closeMenuAndNav('dashboard')}
                >
                    <Store size={18} />
                    <span>Market</span>
                </button>
                <button
                    className={`nav-link ${currentView === 'sell' ? 'active' : ''}`}
                    onClick={() => closeMenuAndNav('sell')}
                >
                    <PlusCircle size={18} />
                    <span>Create</span>
                </button>
                <button
                    className={`nav-link ${currentView === 'profile' ? 'active' : ''}`}
                    onClick={() => closeMenuAndNav('profile')}
                >
                    {userProfile?.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="Avatar" className="nav-avatar" />
                    ) : (
                        <User size={18} />
                    )}
                    <span>Profile</span>
                </button>
                {isAdmin && (
                    <button
                        className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                        onClick={() => closeMenuAndNav('admin')}
                    >
                        <Shield size={18} />
                        <span>Admin</span>
                    </button>
                )}
            </div>

            <div className="nav-actions">
                <button className="btn-icon theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="notifications-wrapper">
                    <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
                        <Bell size={20} />
                        <span className="notification-badge">2</span>
                    </button>
                    {showNotifications && (
                        <div className="notifications-dropdown glass-panel animate-fade-in">
                            <h4>Notifications</h4>
                            {dummyNotifications.map(n => (
                                <div key={n.id} className="notification-item">
                                    <p>{n.text}</p>
                                    <small>{n.time}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {walletConnected ? (
                    <button className="btn-secondary wallet-btn" onClick={() => connectWallet(false)}>
                        <Wallet size={18} className="wallet-icon connected" />
                        <span>{displayAddress}</span>
                    </button>
                ) : (
                    <button className="btn-primary" onClick={() => connectWallet(true)}>
                        Connect MetaMask
                    </button>
                )}

                <button className="btn-secondary logout-btn" onClick={handleLogout} title="Log Out">
                    <LogOut size={18} />
                    <span className="logout-text">Log Out</span>
                </button>

                <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
