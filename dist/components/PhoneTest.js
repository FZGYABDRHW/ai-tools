"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const react_input_mask_1 = __importDefault(require("react-input-mask"));
const { Title, Text } = antd_1.Typography;
const PhoneTest = () => {
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)('');
    const [selectedCountry, setSelectedCountry] = (0, react_1.useState)('DE');
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
    const handlePhoneChange = (e) => {
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
    return ((0, jsx_runtime_1.jsxs)(antd_1.Card, { style: { maxWidth: 600, margin: '20px auto' }, children: [(0, jsx_runtime_1.jsx)(Title, { level: 3, children: "Phone Mask Test" }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(Text, { strong: true, children: ["Selected Country: ", selectedCountry] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(Text, { children: ["Current Mask: ", countryMasks[selectedCountry]] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_input_mask_1.default, { mask: countryMasks[selectedCountry], value: phoneNumber, onChange: handlePhoneChange, placeholder: "Enter phone number", style: {
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                fontSize: '14px'
                            } }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(Text, { children: ["Current Value: ", phoneNumber] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(Text, { children: ["Raw Digits: ", phoneNumber.replace(/\D/g, '')] }) }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: testGermanNumber, type: "primary", children: "Test German Number (+491721727748)" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: clearPhone, children: "Clear" })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Expected German format: +49 172 1727748 (10 digits after country code)" }) })] })] }));
};
exports.default = PhoneTest;
//# sourceMappingURL=PhoneTest.js.map