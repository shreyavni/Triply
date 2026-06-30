import React, { useState } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function AccountSettings({ customName, setCustomName, customLocation, setCustomLocation, onNavigate }) {
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    
    // Forgot Password Flow States
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px', margin: '0 auto' }}>
            {/* Profile Info Form */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Edit Profile</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Display Name</label>
                        <input value={customName} onChange={e => setCustomName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Location</label>
                        <input value={customLocation} onChange={e => setCustomLocation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                    </div>
                    <button onClick={async () => {
                        try {
                            if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: customName });
                            alert("Profile updated successfully!");
                        } catch (err) {
                            alert("Error updating profile: " + err.message);
                        }
                    }} style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: '#111827', color: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', border: 'none' }}>Save Profile</button>
                </div>
            </div>

            {/* Change Password Form */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Security</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isForgotPassword ? (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Current Password</label>
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button onClick={async () => {
                                    if (!currentPassword || !newPassword) return alert("Please enter both current and new password.");
                                    try {
                                        await updatePassword(auth.currentUser, newPassword);
                                        alert("Password updated successfully!");
                                        setCurrentPassword('');
                                        setNewPassword('');
                                    } catch (err) {
                                        alert("Error updating password (you may need to re-authenticate): " + err.message);
                                    }
                                }} style={{ padding: '10px 20px', backgroundColor: '#111827', color: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', border: 'none' }}>Update Password</button>
                                
                                <span onClick={() => setIsForgotPassword(true)} style={{ color: '#f59e0b', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>Forgot Password?</span>
                            </div>
                        </>
                    ) : (
                        <>
                            {!codeSent ? (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Enter Email for Reset Code</label>
                                        <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Your email address" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                                    </div>
                                    <button onClick={() => {
                                        if(!forgotEmail) return;
                                        const code = Math.floor(100000 + Math.random() * 900000).toString();
                                        setResetCode(code);
                                        setCodeSent(true);
                                        alert(`Mock Email Sent! Your code is: ${code}`);
                                    }} style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: '#f59e0b', color: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', border: 'none' }}>Send Code</button>
                                </>
                            ) : !isCodeVerified ? (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Enter 6-Digit Code</label>
                                        <input type="text" value={enteredCode} onChange={e => setEnteredCode(e.target.value)} placeholder="000000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', letterSpacing: '4px', textAlign: 'center', fontSize: '20px' }} />
                                    </div>
                                    <button onClick={() => {
                                        if(enteredCode === resetCode) {
                                            setIsCodeVerified(true);
                                        } else {
                                            alert("Incorrect code!");
                                        }
                                    }} style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', border: 'none' }}>Verify Code</button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Enter New Password</label>
                                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                                    </div>
                                    <button onClick={async () => {
                                        if (!newPassword) return;
                                        try {
                                            await updatePassword(auth.currentUser, newPassword);
                                            alert("Password successfully reset!");
                                            setIsForgotPassword(false);
                                            setCodeSent(false);
                                            setIsCodeVerified(false);
                                            setNewPassword('');
                                        } catch (err) {
                                            alert("Error updating password: " + err.message);
                                        }
                                    }} style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: '#111827', color: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', border: 'none' }}>Reset Password</button>
                                </>
                            )}
                            <span onClick={() => { setIsForgotPassword(false); setCodeSent(false); setIsCodeVerified(false); setEnteredCode(''); }} style={{ color: '#6b7280', fontSize: '14px', cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}>Cancel Reset</span>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
