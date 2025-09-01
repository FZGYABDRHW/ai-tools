import React, { useState } from 'react';
import { Card, Typography, Space, Button } from 'antd';
import InputMask from 'react-input-mask';

const { Title, Text } = Typography;

const PhoneTest: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('DE');

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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPhoneNumber(newValue);
        console.log('Phone number changed:', newValue);
        console.log('Raw value (without mask):', newValue.replace(/\D/g, ''));
    };

    const testGermanNumber = () => {
        // Simulate entering the German number +491721727748
        const germanNumber = '+49 172 1727748';
        setPhoneNumber(germanNumber);
        console.log('Testing German number:', germanNumber);
    };

    const clearPhone = () => {
        setPhoneNumber('');
        console.log('Phone number cleared');
    };

    return (
        <Card style={{ maxWidth: 600, margin: '20px auto' }}>
            <Title level={3}>Phone Mask Test</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Text strong>Selected Country: {selectedCountry}</Text>
                </div>
                <div>
                    <Text>Current Mask: {countryMasks[selectedCountry as keyof typeof countryMasks]}</Text>
                </div>
                <div>
                    <InputMask
                        mask={countryMasks[selectedCountry as keyof typeof countryMasks]}
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter phone number"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <div>
                    <Text>Current Value: {phoneNumber}</Text>
                </div>
                <div>
                    <Text>Raw Digits: {phoneNumber.replace(/\D/g, '')}</Text>
                </div>
                <Space>
                    <Button onClick={testGermanNumber} type="primary">
                        Test German Number (+491721727748)
                    </Button>
                    <Button onClick={clearPhone}>
                        Clear
                    </Button>
                </Space>
                <div>
                    <Text type="secondary">
                        Expected German format: +49 172 1727748 (10 digits after country code)
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default PhoneTest;
