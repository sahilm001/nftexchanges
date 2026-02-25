import React, { useState, useRef } from 'react';
import { calculateLoyalty } from '../services/LoyaltyService';
import { Edit3, Check, X, Upload, Star, Award, Zap } from 'lucide-react';
import './Profile.css';

const Profile = ({ nfts, userAddress, userProfile, updateUserProfile, showToast }) => {
    const ownedNfts = nfts.filter(nft => nft.owner === userAddress);
    const createdNfts = nfts.filter(nft => nft.seller === userAddress);
    const loyalty = calculateLoyalty(ownedNfts.length);

    const [activeTab, setActiveTab] = useState('collected');
    const [selectedNft, setSelectedNft] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        dob: userProfile.dob || '',
        avatarUrl: userProfile.avatarUrl || ''
    });

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                showToast('Image must be less than 5MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatarUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) {
            showToast('Name and Email are required', 'error');
            return;
        }
        updateUserProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className="profile-view animate-fade-in">
            <div className="profile-header glass-panel">
                <div className="avatar">
                    {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="Profile" className="avatar-image" />
                    ) : (
                        <div className="avatar-placeholder gradient-bg"></div>
                    )}
                </div>
                <div className="profile-info">
                    <div className="profile-name-row">
                        <h1 className="gradient-text">{userProfile.fullName || 'Unnamed Explorer'}</h1>
                        {!isEditing && (
                            <button className="btn-icon" onClick={() => setIsEditing(true)}>
                                <Edit3 size={18} />
                            </button>
                        )}
                    </div>
                    <div className="wallet-pill">
                        <span className="address">{userProfile.address}</span>
                    </div>
                    <div className="balance-info">
                        <span className="label">Wallet Balance</span>
                        <span className="value">{userProfile.balance} ETH</span>
                    </div>

                    <div className="loyalty-section">
                        <div className="loyalty-header">
                            <div className="loyalty-badge">
                                <div className="tier-dot" style={{ backgroundColor: loyalty.tierColor }}></div>
                                <span>{loyalty.tier} Tier</span>
                                <span className="pts-text">• {loyalty.points} PTS</span>
                            </div>
                            {loyalty.nextTier && (
                                <span className="next-tier-hint">Next: {loyalty.nextTier}</span>
                            )}
                        </div>

                        <div className="progress-bar-container">
                            <div
                                className="progress-fill gradient-bg"
                                style={{ width: `${Math.min(100, (loyalty.points / (loyalty.points + loyalty.pointsToNext)) * 100)}%` }}
                            ></div>
                        </div>

                        <div className="achievements-row mt-2">
                            <div className="achievement-badge" title="First Mint">
                                <Star size={14} className="achievement-icon" />
                            </div>
                            <div className="achievement-badge" title="Early Adopter">
                                <Zap size={14} className="achievement-icon" />
                            </div>
                            {loyalty.points >= 50 && (
                                <div className="achievement-badge gold" title="Whale Status">
                                    <Award size={14} className="achievement-icon" />
                                </div>
                            )}
                            <button
                                className="btn-secondary redeem-btn ml-auto"
                                onClick={() => showToast('Rewards portal coming soon!', 'success')}
                            >
                                Redeem Points
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="edit-profile-section glass-panel animate-fade-in">
                    <div className="edit-profile-header">
                        <h2>Edit Profile</h2>
                        <button className="btn-icon circle" onClick={() => setIsEditing(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <form className="edit-profile-form" onSubmit={handleSave}>
                        <div className="form-grid">
                            <div className="form-group dp-upload-group">
                                <label>Profile Picture</label>
                                <div
                                    className="dp-dropzone"
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ backgroundImage: formData.avatarUrl ? `url(${formData.avatarUrl})` : 'none' }}
                                >
                                    {!formData.avatarUrl && (
                                        <div className="dp-placeholder-content">
                                            <Upload size={24} />
                                            <span>Click to upload</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="form-fields">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">
                                <Check size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="profile-tabs mt-4">
                <button
                    className={`tab ${activeTab === 'collected' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collected')}
                >
                    Collected ({ownedNfts.length})
                </button>
                <button
                    className={`tab ${activeTab === 'created' ? 'active' : ''}`}
                    onClick={() => setActiveTab('created')}
                >
                    Created ({createdNfts.length})
                </button>
                <button className="tab" onClick={() => showToast('Activity history is coming soon!', 'success')}>Activity</button>
            </div>

            <div className="nft-grid">
                {(activeTab === 'collected' ? ownedNfts : createdNfts).map(nft => (
                    <div key={nft.id} className="nft-card glass-panel" onClick={() => setSelectedNft(nft)}>
                        <div className="nft-image-container">
                            <img src={nft.image} alt={nft.name} className="nft-image" />
                        </div>
                        <div className="nft-info">
                            <h3>{nft.name}</h3>
                            {nft.isListed ? (
                                <div className="status-badge listed">Listed for {nft.price} ETH</div>
                            ) : (
                                <div className="status-badge unlisted">In Vault</div>
                            )}
                        </div>
                    </div>
                ))}

                {(activeTab === 'collected' ? ownedNfts : createdNfts).length === 0 && (
                    <div className="empty-state glass-panel">
                        <h3>No NFTs found here.</h3>
                        <p>{activeTab === 'collected' ? 'Go to the market to find your first NFT!' : 'Try minting your first NFT in the Create drop section!'}</p>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
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
                                    <span className="value truncate">{selectedNft.seller || 'Unknown'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Owner</span>
                                    <span className="value truncate">{selectedNft.owner}</span>
                                </div>
                                {selectedNft.category && (
                                    <div className="detail-row">
                                        <span className="label">Category</span>
                                        <span className="value badge-outline">{selectedNft.category}</span>
                                    </div>
                                )}

                                <div className="price-box glass-panel">
                                    <span className="label">Status</span>
                                    <div className="price-amount" style={{ fontSize: '1.5rem' }}>
                                        {selectedNft.isListed ? `Listed For: ${selectedNft.price} ETH` : 'Not For Sale (Vaulted)'}
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button className="btn-secondary full-width" onClick={() => setSelectedNft(null)}>
                                        Close Details
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

export default Profile;
