import React, { useContext, useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import ServerSelector from './ServerSelector';
import { ServerRegion } from '../types';
import logo from '../logo.png';
import InputMask from 'react-input-mask';

// CSS to override Ant Design Select borders
const selectStyles = `
  .country-select-no-border .ant-select-selector {
    border: none !important;
    border-right: none !important;
    box-shadow: none !important;
  }
  .country-select-no-border .ant-select-selection-item {
    border: none !important;
  }
  .country-select-no-border:hover .ant-select-selector {
    border: none !important;
    border-right: none !important;
  }
  .country-select-no-border:focus .ant-select-selector {
    border: none !important;
    border-right: none !important;
    box-shadow: none !important;
  }
`;

const { Content } = Layout;

// Multi-country phone input component
const MultiCountryPhoneInput = ({ value, onChange, placeholder }: {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}) => {
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [phoneNumber, setPhoneNumber] = useState(value || '');

    const countryMasks = {
        'US': '+1 (999) 999-9999',
        'CA': '+1 (999) 999-9999',
        'UK': '+44 9999 999999',
        'DE': '+49 999 9999999',
        'FR': '+33 9 99 99 99 99',
        'IT': '+39 999 999 9999',
        'ES': '+34 999 999 999',
        'RU': '+7 (999) 999-99-99',
        'CN': '+86 999 9999 9999',
        'JP': '+81 99-9999-9999',
        'AU': '+61 999 999 999',
        'BR': '+55 99 99999-9999',
        'IN': '+91 99999 99999',
        'MX': '+52 999 999 9999',
        'KR': '+82 99-9999-9999',
        'NL': '+31 9 99999999',
        'SE': '+46 99 999 99 99',
        'NO': '+47 999 99 999',
        'DK': '+45 99 99 99 99',
        'FI': '+358 99 999 9999'
    };

    const countryOptions = [
        { value: 'US', label: '🇺🇸 United States', code: '+1' },
        { value: 'CA', label: '🇨🇦 Canada', code: '+1' },
        { value: 'UK', label: '🇬🇧 United Kingdom', code: '+44' },
        { value: 'DE', label: '🇩🇪 Germany', code: '+49' },
        { value: 'FR', label: '🇫🇷 France', code: '+33' },
        { value: 'IT', label: '🇮🇹 Italy', code: '+39' },
        { value: 'ES', label: '🇪🇸 Spain', code: '+34' },
        { value: 'RU', label: '🇷🇺 Russia', code: '+7' },
        { value: 'CN', label: '🇨🇳 China', code: '+86' },
        { value: 'JP', label: '🇯🇵 Japan', code: '+81' },
        { value: 'AU', label: '🇦🇺 Australia', code: '+61' },
        { value: 'BR', label: '🇧🇷 Brazil', code: '+55' },
        { value: 'IN', label: '🇮🇳 India', code: '+91' },
        { value: 'MX', label: '🇲🇽 Mexico', code: '+52' },
        { value: 'KR', label: '🇰🇷 South Korea', code: '+82' },
        { value: 'NL', label: '🇳🇱 Netherlands', code: '+31' },
        { value: 'SE', label: '🇸🇪 Sweden', code: '+46' },
        { value: 'NO', label: '🇳�� Norway', code: '+47' },
        { value: 'DK', label: '🇩🇰 Denmark', code: '+45' },
        { value: 'FI', label: '🇫🇮 Finland', code: '+358' }
    ];

    const handleCountryChange = (countryCode: string) => {
        setSelectedCountry(countryCode);
        setPhoneNumber('');
        onChange?.('');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPhoneNumber(newValue);
        onChange?.(newValue);
    };

    return (
        <>
            <style>{selectStyles}</style>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                height: '48px'
            }}
        onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ff8c69';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 140, 105, 0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e8e8e8';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }}
        >
            <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                style={{
                    width: 140,
                    border: 'none !important',
                    borderRadius: '8px 0 0 8px',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    fontWeight: 500,
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center'
                }}
                className="country-select-no-border"
                dropdownStyle={{ 
                    zIndex: 9999,
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    border: '1px solid #e8e8e8',
                    padding: '8px 0'
                }}
                suffixIcon={
                    <div style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        marginRight: '8px',
                        transition: 'transform 0.2s ease'
                    }}>
                        ▼
                    </div>
                }
                optionLabelProp="label"
                dropdownRender={(menu) => (
                    <div>
                        <div style={{
                            padding: '8px 16px',
                            borderBottom: '1px solid #f0f0f0',
                            fontSize: '12px',
                            color: '#666',
                            fontWeight: 500
                        }}>
                            Select Country
                        </div>
                        {menu}
                    </div>
                )}
            >
                {countryOptions.map(country => (
                    <Select.Option 
                        key={country.value} 
                        value={country.value}
                        label={country.label}
                        style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            borderRadius: '8px',
                            margin: '2px 8px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px'
                        }}>
                            <span style={{ 
                                fontSize: '20px',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                            }}>
                                {country.label.split(' ')[0]}
                            </span>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{ 
                                    color: '#333', 
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    lineHeight: '1.2'
                                }}>
                                    {country.label.split(' ').slice(1).join(' ')}
                                </span>
                                <span style={{ 
                                    color: '#666', 
                                    fontSize: '12px',
                                    fontWeight: 400
                                }}>
                                    {country.code}
                                </span>
                            </div>
                        </div>
                    </Select.Option>
                ))}
            </Select>
            <InputMask
                mask={countryMasks[selectedCountry as keyof typeof countryMasks]}
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={placeholder}
                style={{
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    fontSize: '14px',
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#333',
                    fontWeight: 400
                }}
            />
        </div>
        </>
    );
};

const LoginScreen: React.FC = () => {
    const { login, isLoading, selectedServer } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [currentServer, setCurrentServer] = useState<ServerRegion>(selectedServer);
    
    // Update currentServer when selectedServer changes
    useEffect(() => {
        setCurrentServer(selectedServer);
    }, [selectedServer]);
    
    // Animation speed multiplier based on loading state
    const animationSpeed = isLoading ? 0.15 : 1; // 6.7x faster when loading
    const animationDepth = isLoading ? 2.5 : 1; // 2.5x deeper when loading
    const circleRadius = isLoading ? 100 : 0; // Circle radius when loading

    const handleLogin = async (values: { phone: string; password: string }) => {
        // Normalize phone number by removing all non-digit characters except the plus sign
        const normalizedPhone = values.phone.replace(/[^\d+]/g, '');
        
        
        const success = await login({ 
            ...values, 
            phone: normalizedPhone, 
            server: currentServer 
        });
        if (success) {
            form.resetFields();
        }
    };

    return (
        <Layout style={{ 
            minHeight: '100vh', 
            background: isLoading 
                ? 'linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%)'
                : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.5s ease-in-out'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                pointerEvents: 'none'
            }}>
                {/* Floating Orbs */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(255, 140, 105, 0.25) 0%, rgba(255, 140, 105, 0.15) 50%, rgba(255, 140, 105, 0.05) 100%)',
                    borderRadius: '50%',
                    animation: isLoading 
                        ? `circleMove1 ${3 * animationSpeed}s linear infinite, float ${6 * animationSpeed}s ease-in-out infinite`
                        : `float ${6 * animationSpeed}s ease-in-out infinite`,
                    transform: `translate(-50%, -50%) translate(${isLoading ? circleRadius : 0}px, 0px) scale(${animationDepth})`,
                    boxShadow: `0 ${8 * animationDepth}px ${32 * animationDepth}px rgba(255, 140, 105, ${0.2 * animationDepth})`,
                    transition: 'all 0.8s ease-in-out'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '80px',
                    height: '80px',
                    background: 'radial-gradient(circle, rgba(255, 140, 105, 0.3) 0%, rgba(255, 140, 105, 0.2) 50%, rgba(255, 140, 105, 0.1) 100%)',
                    borderRadius: '50%',
                    animation: isLoading 
                        ? `circleMove2 ${4 * animationSpeed}s linear infinite, float ${8 * animationSpeed}s ease-in-out infinite reverse`
                        : `float ${8 * animationSpeed}s ease-in-out infinite reverse`,
                    transform: `translate(-50%, -50%) translate(${isLoading ? circleRadius * 0.8 : 0}px, ${isLoading ? circleRadius * 0.6 : 0}px) scale(${animationDepth})`,
                    boxShadow: `0 ${6 * animationDepth}px ${24 * animationDepth}px rgba(255, 140, 105, ${0.25 * animationDepth})`,
                    transition: 'all 0.8s ease-in-out'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: isLoading ? '35%' : '15%',
                    left: isLoading ? '35%' : '20%',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(255, 140, 105, 0.2) 0%, rgba(255, 140, 105, 0.12) 50%, rgba(255, 140, 105, 0.05) 100%)',
                    borderRadius: '50%',
                    animation: `float ${7 * animationSpeed}s ease-in-out infinite`,
                    transform: `translateY(0px) scale(${animationDepth})`,
                    boxShadow: `0 ${8 * animationDepth}px ${28 * animationDepth}px rgba(255, 140, 105, ${0.18 * animationDepth})`,
                    transition: 'all 0.8s ease-in-out'
                }} />
                <div style={{
                    position: 'absolute',
                    top: isLoading ? '45%' : '60%',
                    left: isLoading ? '45%' : '5%',
                    width: '60px',
                    height: '60px',
                    background: 'radial-gradient(circle, rgba(255, 140, 105, 0.35) 0%, rgba(255, 140, 105, 0.25) 50%, rgba(255, 140, 105, 0.1) 100%)',
                    borderRadius: '50%',
                    animation: `float ${5 * animationSpeed}s ease-in-out infinite reverse`,
                    transform: `translateY(0px) scale(${animationDepth})`,
                    boxShadow: `0 ${4 * animationDepth}px ${20 * animationDepth}px rgba(255, 140, 105, ${0.3 * animationDepth})`,
                    transition: 'all 0.8s ease-in-out'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: isLoading ? '40%' : '30%',
                    right: isLoading ? '40%' : '5%',
                    width: '90px',
                    height: '90px',
                    background: 'radial-gradient(circle, rgba(255, 140, 105, 0.28) 0%, rgba(255, 140, 105, 0.18) 50%, rgba(255, 140, 105, 0.08) 100%)',
                    borderRadius: '50%',
                    animation: `float ${9 * animationSpeed}s ease-in-out infinite`,
                    transform: `translateY(0px) scale(${animationDepth})`,
                    boxShadow: `0 ${6 * animationDepth}px ${26 * animationDepth}px rgba(255, 140, 105, ${0.22 * animationDepth})`,
                    transition: 'all 0.8s ease-in-out'
                }} />
                
                {/* Geometric Shapes */}
                <div style={{
                    position: 'absolute',
                    top: isLoading ? '42%' : '30%',
                    left: isLoading ? '42%' : '5%',
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(45deg, rgba(255, 140, 105, 0.25), rgba(255, 140, 105, 0.15))',
                    borderRadius: '12px',
                    animation: `rotate ${20 * animationSpeed}s linear infinite`,
                    transform: `rotate(0deg) scale(${animationDepth})`,
                    boxShadow: `0 ${4 * animationDepth}px ${16 * animationDepth}px rgba(255, 140, 105, ${0.2 * animationDepth})`,
                    transition: 'all 0.8s ease-in-out'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    right: '10%',
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(45deg, rgba(255, 140, 105, 0.3), rgba(255, 140, 105, 0.2))',
                    borderRadius: '8px',
                    animation: `rotate ${15 * animationSpeed}s linear infinite reverse`,
                    transform: `rotate(0deg) scale(${animationDepth})`,
                    boxShadow: `0 ${3 * animationDepth}px ${12 * animationDepth}px rgba(255, 140, 105, ${0.25 * animationDepth})`
                }} />
                <div style={{
                    position: 'absolute',
                    top: '70%',
                    right: '25%',
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(45deg, rgba(255, 140, 105, 0.35), rgba(255, 140, 105, 0.25))',
                    borderRadius: '10px',
                    animation: `rotate ${18 * animationSpeed}s linear infinite`,
                    transform: `rotate(0deg) scale(${animationDepth})`,
                    boxShadow: `0 ${4 * animationDepth}px ${18 * animationDepth}px rgba(255, 140, 105, ${0.3 * animationDepth})`
                }} />
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '60%',
                    width: '35px',
                    height: '35px',
                    background: 'linear-gradient(45deg, rgba(255, 140, 105, 0.4), rgba(255, 140, 105, 0.3))',
                    borderRadius: '6px',
                    animation: `rotate ${12 * animationSpeed}s linear infinite reverse`,
                    transform: `rotate(0deg) scale(${animationDepth})`,
                    boxShadow: `0 ${3 * animationDepth}px ${14 * animationDepth}px rgba(255, 140, 105, ${0.35 * animationDepth})`
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(45deg, rgba(255, 140, 105, 0.28), rgba(255, 140, 105, 0.18))',
                    borderRadius: '8px',
                    animation: `rotate ${22 * animationSpeed}s linear infinite`,
                    transform: `rotate(0deg) scale(${animationDepth})`,
                    boxShadow: `0 ${3 * animationDepth}px ${15 * animationDepth}px rgba(255, 140, 105, ${0.22 * animationDepth})`
                }} />
                
                {/* Enhanced Grid Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        linear-gradient(rgba(255, 140, 105, 0.08) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 140, 105, 0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: `gridMove ${30 * animationSpeed}s linear infinite`,
                    transform: 'translate(0px, 0px)',
                    opacity: animationDepth
                }} />
                
                {/* Additional Animated Lines */}
                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '0%',
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 140, 105, 0.3), transparent)',
                    animation: `slideRight ${8 * animationSpeed}s ease-in-out infinite`,
                    transform: 'translateX(-100%)',
                    boxShadow: `0 0 ${10 * animationDepth}px rgba(255, 140, 105, ${0.3 * animationDepth})`
                }} />
                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '0%',
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 140, 105, 0.25), transparent)',
                    animation: `slideLeft ${10 * animationSpeed}s ease-in-out infinite`,
                    transform: 'translateX(100%)',
                    boxShadow: `0 0 ${8 * animationDepth}px rgba(255, 140, 105, ${0.25 * animationDepth})`
                }} />
                
                {/* Pulsing Elements */}
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    right: '8%',
                    width: '20px',
                    height: '20px',
                    background: 'radial-gradient(circle, rgba(255, 140, 105, 0.6) 0%, rgba(255, 140, 105, 0.3) 50%, transparent 100%)',
                    borderRadius: '50%',
                    animation: `pulse ${4 * animationSpeed}s ease-in-out infinite`,
                    boxShadow: `0 0 ${20 * animationDepth}px rgba(255, 140, 105, ${0.4 * animationDepth})`,
                    transform: `scale(${animationDepth})`
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '40%',
                    left: '8%',
                    width: '15px',
                    height: '15px',
                    background: 'radial-gradient(circle, rgba(255, 140, 105, 0.7) 0%, rgba(255, 140, 105, 0.4) 50%, transparent 100%)',
                    borderRadius: '50%',
                    animation: `pulse ${3 * animationSpeed}s ease-in-out infinite reverse`,
                    boxShadow: `0 0 ${15 * animationDepth}px rgba(255, 140, 105, ${0.5 * animationDepth})`,
                    transform: `scale(${animationDepth})`
                }} />
                
                {/* Loading-Only Intense Effects */}
                {isLoading && (
                    <>
                        {/* Rapidly Spinning Elements */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(255, 140, 105, 0.05) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'rotate 2s linear infinite',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 30px rgba(255, 140, 105, 0.2)'
                        }} />
                        
                        {/* Energy Bursts */}
                        <div style={{
                            position: 'absolute',
                            top: '20%',
                            left: '30%',
                            width: '4px',
                            height: '4px',
                            background: 'rgba(255, 140, 105, 0.4)',
                            borderRadius: '50%',
                            animation: 'pulse 0.5s ease-in-out infinite',
                            boxShadow: '0 0 15px rgba(255, 140, 105, 0.4)'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '80%',
                            right: '20%',
                            width: '6px',
                            height: '6px',
                            background: 'rgba(255, 140, 105, 0.5)',
                            borderRadius: '50%',
                            animation: 'pulse 0.3s ease-in-out infinite reverse',
                            boxShadow: '0 0 20px rgba(255, 140, 105, 0.5)'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '40%',
                            right: '40%',
                            width: '3px',
                            height: '3px',
                            background: 'rgba(255, 140, 105, 0.3)',
                            borderRadius: '50%',
                            animation: 'pulse 0.7s ease-in-out infinite',
                            boxShadow: '0 0 10px rgba(255, 140, 105, 0.3)'
                        }} />
                        
                        {/* Intense Wave Lines */}
                        <div style={{
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            background: `
                                repeating-linear-gradient(
                                    45deg,
                                    transparent,
                                    transparent 10px,
                                    rgba(255, 140, 105, 0.05) 10px,
                                    rgba(255, 140, 105, 0.05) 20px
                                )
                            `,
                            animation: 'gridMove 5s linear infinite',
                            opacity: 0.15
                        }} />
                        
                        {/* Central Energy Core */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '100px',
                            height: '100px',
                            background: 'radial-gradient(circle, rgba(255, 140, 105, 0.2) 0%, rgba(255, 140, 105, 0.1) 50%, transparent 100%)',
                            borderRadius: '50%',
                            animation: 'pulse 1s ease-in-out infinite',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 40px rgba(255, 140, 105, 0.3)'
                        }} />
                    </>
                )}
            </div>
            
            <Content style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '24px',
                position: 'relative',
                zIndex: 1
            }}>
                <Card 
                    style={{ 
                        maxWidth: 450, 
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <img 
                            src={logo} 
                            alt="Wowworks Logo" 
                            style={{ 
                                height: '120px', 
                                width: 'auto',
                                marginBottom: '16px'
                            }} 
                        />
                    </div>

                    <Form
                        form={form}
                        onFinish={handleLogin}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item label="Server Region" style={{ marginBottom: '20px' }}>
                            <ServerSelector />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[
                                { required: true, message: 'Please enter your phone number' },
                                { 
                                    pattern: /^\+?[\d\s\-()]+$/, 
                                    message: 'Please enter a valid phone number' 
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value) return Promise.resolve();
                                        const digits = value.replace(/\D/g, '');
                                        if (digits.length < 10) {
                                            return Promise.reject(new Error('Phone number must have at least 10 digits'));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <MultiCountryPhoneInput
                                placeholder="Phone number"
                                onChange={(value) => form.setFieldsValue({ phone: value })}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                style={{ height: '48px', borderRadius: '8px' }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '16px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                style={{ 
                                    width: '100%', 
                                    height: '48px', 
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    background: '#ff8c69',
                                    borderColor: '#ff8c69'
                                }}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </Form.Item>
                    </Form>


                </Card>
            </Content>
        </Layout>
    );
};

export default LoginScreen;
