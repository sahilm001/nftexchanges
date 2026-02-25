import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Filter, TrendingUp, Award, Box } from 'lucide-react';
import { calculateLoyalty } from '../services/LoyaltyService';
import './Dashboard.css';

const Dashboard = ({ nfts, buyNft, userAddress, userProfile }) => {
    const [selectedNft, setSelectedNft] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Calculate user's loyalty points
    const ownedNfts = nfts.filter(nft => nft.owner === userAddress);
    const { points } = calculateLoyalty(ownedNfts.length);

    // Filter logic
    const displayNfts = useMemo(() => {
        return nfts.filter(nft => {
            if (!nft.isListed || nft.owner === userAddress) return false;

            const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                nft.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || nft.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [nfts, userAddress, searchQuery, categoryFilter]);

    const totalVolume = nfts.reduce((acc, curr) => acc + parseFloat(curr.price), 0).toFixed(1);

    const handleBuy = (nft) => {
        buyNft(nft);
        setSelectedNft(null);
    };

    return (
        <div className="dashboard animate-fade-in">
            {/* Analytics Header */}
            <div className="analytics-header">
                <div className="analytics-card glass-panel">
                    <div className="analytics-icon"><Box size={24} /></div>
                    <div className="analytics-info">
                        <span className="label">Total Listed</span>
                        <span className="value">{nfts.filter(n => n.isListed).length} NFTs</span>
                    </div>
                </div>

                <div className="analytics-card glass-panel">
                    <div className="analytics-icon"><TrendingUp size={24} /></div>
                    <div className="analytics-info">
                        <span className="label">Platform Volume</span>
                        <span className="value">{totalVolume} ETH</span>
                    </div>
                    {/* Pure CSS Animated Bar Chart mock */}
                    <div className="mini-chart">
                        <div className="bar" style={{ height: '40%' }}></div>
                        <div className="bar" style={{ height: '70%' }}></div>
                        <div className="bar" style={{ height: '50%' }}></div>
                        <div className="bar" style={{ height: '90%' }}></div>
                        <div className="bar" style={{ height: '60%' }}></div>
                    </div>
                </div>

                <div className="analytics-card glass-panel">
                    <div className="analytics-icon"><Award size={24} /></div>
                    <div className="analytics-info">
                        <span className="label">Your Points</span>
                        <span className="value">{points} PTS</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-header mt-4">
                <div className="header-titles">
                    <h1 className="gradient-text">Top Collections</h1>
                    <p className="subtitle">Discover, collect, and sell extraordinary NFTs</p>
                </div>

                <div className="controls-row">
                    <div className="search-bar glass-panel">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search NFTs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-dropdown glass-panel">
                        <Filter size={18} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Art">Art</option>
                            <option value="Gaming">Gaming</option>
                            <option value="PFP">PFP</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="nft-grid">
                {displayNfts.map(nft => (
                    <div key={nft.id} className="nft-card glass-panel" onClick={() => setSelectedNft(nft)}>
                        <div className="nft-image-container">
                            <img src={nft.image} alt={nft.name} className="nft-image" />
                        </div>
                        <div className="nft-info">
                            <h3>{nft.name}</h3>
                            <div className="nft-price-row">
                                <span className="price-label">Current Price</span>
                                <span className="price-value">{nft.price} ETH</span>
                            </div>
                        </div>
                    </div>
                ))}
                {displayNfts.length === 0 && (
                    <div className="empty-state glass-panel">
                        <h3>No NFTs currently listed</h3>
                        <p>Check back later for new drops!</p>
                    </div>
                )}
            </div>

            {/* Buy Modal */}
            {selectedNft && (
                <div className="modal-overlay" onClick={() => setSelectedNft(null)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-split">
                            <div className="modal-image">
                                <img src={selectedNft.image} alt={selectedNft.name} />
                            </div>
                            <div className="modal-details">
                                <h2>{selectedNft.name}</h2>
                                <p className="description">{selectedNft.description}</p>

                                <div className="detail-row">
                                    <span className="label">Creator</span>
                                    <span className="value truncate">{selectedNft.seller}</span>
                                </div>

                                <div className="price-box glass-panel">
                                    <span className="label">Price</span>
                                    <div className="price-amount">
                                        <span className="eth-icon">⟠</span>
                                        <strong>{selectedNft.price}</strong> ETH
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button className="btn-primary buy-btn" onClick={() => handleBuy(selectedNft)}>
                                        <ShoppingCart size={18} />
                                        Buy Now
                                    </button>
                                    <button className="btn-secondary" onClick={() => setSelectedNft(null)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
