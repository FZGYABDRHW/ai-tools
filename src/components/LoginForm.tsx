import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, Select } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuth } from '../machines';
import ServerSelector from './ServerSelector';
import { ServerRegion } from '../types';

const { Title, Text } = Typography;

// Custom Phone Input component with country selection
const AntPhoneInput = React.forwardRef<HTMLDivElement, {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    size?: 'large' | 'middle' | 'small';
    style?: React.CSSProperties;
}>(({ value, onChange, placeholder, size = 'large', style }, ref) => {
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [phoneNumber, setPhoneNumber] = useState(value || '');

    const countryOptions = [
        { value: 'US', label: '🇺🇸 +1', code: '+1' },
        { value: 'RU', label: '🇷🇺 +7', code: '+7' },
        { value: 'GB', label: '🇬🇧 +44', code: '+44' },
        { value: 'DE', label: '🇩🇪 +49', code: '+49' },
        { value: 'FR', label: '🇫🇷 +33', code: '+33' },
        { value: 'IT', label: '🇮🇹 +39', code: '+39' },
        { value: 'ES', label: '🇪🇸 +34', code: '+34' },
        { value: 'CA', label: '🇨🇦 +1', code: '+1' },
        { value: 'AU', label: '🇦🇺 +61', code: '+61' },
        { value: 'JP', label: '🇯🇵 +81', code: '+81' },
        { value: 'CN', label: '🇨🇳 +86', code: '+86' },
        { value: 'IN', label: '🇮🇳 +91', code: '+91' },
        { value: 'BR', label: '🇧🇷 +55', code: '+55' },
        { value: 'MX', label: '🇲🇽 +52', code: '+52' },
        { value: 'KR', label: '🇰🇷 +82', code: '+82' },
    ];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setPhoneNumber(newValue);
        const country = countryOptions.find(c => c.value === selectedCountry);
        onChange?.(country ? `${country.code}${newValue}` : newValue);
    };

    const handleCountryChange = (countryCode: string) => {
        setSelectedCountry(countryCode);
        const country = countryOptions.find(c => c.value === countryCode);
        if (phoneNumber) {
            onChange?.(country ? `${country.code}${phoneNumber}` : phoneNumber);
        }
    };

    const formatPhoneNumber = (value: string) => {
        const digits = value.replace(/\D/g, '');

        // Handle different country formats
        switch (selectedCountry) {
            case 'DE':
                // German format: +49 172 1727748
                if (digits.length <= 3) return digits;
                if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
                return `${digits.slice(0, 3)} ${digits.slice(3, 6)}${digits.slice(6)}`;
            case 'RU':
                // Russian format: +7 (999) 999-99-99
                if (digits.length <= 3) return digits;
                if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                if (digits.length <= 8) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
            case 'GB':
                // UK format: +44 9999 999999
                if (digits.length <= 4) return digits;
                if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
                return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
            case 'FR':
                // French format: +33 9 99 99 99 99
                if (digits.length <= 1) return digits;
                if (digits.length <= 3) return `${digits.slice(0, 1)} ${digits.slice(1)}`;
                if (digits.length <= 5) return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3)}`;
                if (digits.length <= 7) return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
                if (digits.length <= 9) return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
                return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
            default:
                // US/Canada format: XXX-XXX-XXXX
                if (digits.length <= 3) return digits;
                if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
                return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    };

    return (
        <div
            ref={ref}
            className="phone-input-container"
            style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #d9d9d9',
                borderRadius: size === 'large' ? '6px' : size === 'middle' ? '6px' : '4px',
                backgroundColor: '#fff',
                transition: 'all 0.3s',
                minHeight: size === 'large' ? '40px' : size === 'middle' ? '32px' : '24px',
                overflow: 'hidden',
                ...style
            }}
        >
            <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                style={{
                    width: 80,
                    border: 'none',
                    borderRight: '1px solid #d9d9d9',
                    borderRadius: 0,
                    backgroundColor: '#fafafa'
                }}
                dropdownStyle={{ zIndex: 9999 }}
            >
                {countryOptions.map(country => (
                    <Select.Option key={country.value} value={country.value}>
                        {country.label}
                    </Select.Option>
                ))}
            </Select>
            <Input
                value={formatPhoneNumber(phoneNumber)}
                onChange={handlePhoneChange}
                placeholder={placeholder}
                style={{
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    fontSize: size === 'large' ? '14px' : size === 'middle' ? '14px' : '12px',
                    backgroundColor: 'transparent',
                    padding: size === 'large' ? '8px 12px' : size === 'middle' ? '6px 12px' : '4px 12px',
                    margin: 0,
                    boxShadow: 'none'
                }}
            />
        </div>
    );
});

const LoginForm: React.FC = () => {
    const { authToken, login, logout, isLoading, user, selectedServer } = useAuth();
    const [form] = Form.useForm();
    const [currentServer, setCurrentServer] = useState<ServerRegion>(selectedServer);

    // Update currentServer when selectedServer changes
    useEffect(() => {
        setCurrentServer(selectedServer);
    }, [selectedServer]);

    const handleLogin = async (values: { phone: string; password: string }) => {
        // Normalize phone number by removing all non-digit characters except the plus sign
        const normalizedPhone = values.phone.replace(/[^\d+]/g, '');
        console.log('Original phone:', values.phone);
        console.log('Normalized phone:', normalizedPhone);
        console.log('Selected server:', selectedServer);

        const success = await login({
            ...values,
            phone: normalizedPhone,
            server: currentServer
        });
        if (success) {
            form.resetFields();
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    if (authToken && user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text strong style={{ color: '#666', fontSize: '14px', lineHeight: 1 }}>
                            {user.name}
                        </Text>
                        <Text style={{ color: '#999', fontSize: '12px', lineHeight: 1 }}>
                            {user.phone}
                        </Text>
                    </div>
                </div>
                <Button
                    type="default"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    loading={isLoading}
                    size="large"
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ServerSelector />
            <Form
                form={form}
                onFinish={handleLogin}
                layout="inline"
                style={{ margin: 0 }}
            >
                <Form.Item
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                    style={{ margin: 0 }}
                >
                    <AntPhoneInput
                        placeholder="Phone number"
                        size="large"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                    style={{ margin: 0 }}
                >
                    <Input.Password
                        placeholder="Password"
                        prefix={<LockOutlined />}
                        size="large"
                        style={{ width: 150 }}
                    />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginForm;
