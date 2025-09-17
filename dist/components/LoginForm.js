"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const machines_1 = require("../machines");
const ServerSelector_1 = __importDefault(require("./ServerSelector"));
const { Title, Text } = antd_1.Typography;
// Custom Phone Input component with country selection
const AntPhoneInput = react_1.default.forwardRef(({ value, onChange, placeholder, size = 'large', style }, ref) => {
    const [selectedCountry, setSelectedCountry] = (0, react_1.useState)('US');
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)(value || '');
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
    const handlePhoneChange = (e) => {
        const newValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setPhoneNumber(newValue);
        const country = countryOptions.find(c => c.value === selectedCountry);
        onChange?.(country ? `${country.code}${newValue}` : newValue);
    };
    const handleCountryChange = (countryCode) => {
        setSelectedCountry(countryCode);
        const country = countryOptions.find(c => c.value === countryCode);
        if (phoneNumber) {
            onChange?.(country ? `${country.code}${phoneNumber}` : phoneNumber);
        }
    };
    const formatPhoneNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        // Handle different country formats
        switch (selectedCountry) {
            case 'DE':
                // German format: +49 172 1727748
                if (digits.length <= 3)
                    return digits;
                if (digits.length <= 6)
                    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
                return `${digits.slice(0, 3)} ${digits.slice(3, 6)}${digits.slice(6)}`;
            case 'RU':
                // Russian format: +7 (999) 999-99-99
                if (digits.length <= 3)
                    return digits;
                if (digits.length <= 6)
                    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                if (digits.length <= 8)
                    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
            case 'GB':
                // UK format: +44 9999 999999
                if (digits.length <= 4)
                    return digits;
                if (digits.length <= 8)
                    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
                return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
            case 'FR':
                // French format: +33 9 99 99 99 99
                if (digits.length <= 1)
                    return digits;
                if (digits.length <= 3)
                    return `${digits.slice(0, 1)} ${digits.slice(1)}`;
                if (digits.length <= 5)
                    return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3)}`;
                if (digits.length <= 7)
                    return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
                if (digits.length <= 9)
                    return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
                return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
            default:
                // US/Canada format: XXX-XXX-XXXX
                if (digits.length <= 3)
                    return digits;
                if (digits.length <= 6)
                    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
                return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: ref, className: "phone-input-container", style: {
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #d9d9d9',
            borderRadius: size === 'large' ? '6px' : size === 'middle' ? '6px' : '4px',
            backgroundColor: '#fff',
            transition: 'all 0.3s',
            minHeight: size === 'large' ? '40px' : size === 'middle' ? '32px' : '24px',
            overflow: 'hidden',
            ...style
        }, children: [(0, jsx_runtime_1.jsx)(antd_1.Select, { value: selectedCountry, onChange: handleCountryChange, style: {
                    width: 80,
                    border: 'none',
                    borderRight: '1px solid #d9d9d9',
                    borderRadius: 0,
                    backgroundColor: '#fafafa'
                }, dropdownStyle: { zIndex: 9999 }, children: countryOptions.map(country => ((0, jsx_runtime_1.jsx)(antd_1.Select.Option, { value: country.value, children: country.label }, country.value))) }), (0, jsx_runtime_1.jsx)(antd_1.Input, { value: formatPhoneNumber(phoneNumber), onChange: handlePhoneChange, placeholder: placeholder, style: {
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    fontSize: size === 'large' ? '14px' : size === 'middle' ? '14px' : '12px',
                    backgroundColor: 'transparent',
                    padding: size === 'large' ? '8px 12px' : size === 'middle' ? '6px 12px' : '4px 12px',
                    margin: 0,
                    boxShadow: 'none'
                } })] }));
});
const LoginForm = () => {
    const { authToken, login, logout, isLoading, user, selectedServer } = (0, machines_1.useAuth)();
    const [form] = antd_1.Form.useForm();
    const [currentServer, setCurrentServer] = (0, react_1.useState)(selectedServer);
    // Update currentServer when selectedServer changes
    (0, react_1.useEffect)(() => {
        setCurrentServer(selectedServer);
    }, [selectedServer]);
    const handleLogin = async (values) => {
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
        return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.UserOutlined, { style: { color: '#1890ff', fontSize: '16px' } }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }, children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, style: { color: '#666', fontSize: '14px', lineHeight: 1 }, children: user.name }), (0, jsx_runtime_1.jsx)(Text, { style: { color: '#999', fontSize: '12px', lineHeight: 1 }, children: user.phone })] })] }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", icon: (0, jsx_runtime_1.jsx)(icons_1.LogoutOutlined, {}), onClick: handleLogout, loading: isLoading, size: "large", children: "Logout" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [(0, jsx_runtime_1.jsx)(ServerSelector_1.default, {}), (0, jsx_runtime_1.jsxs)(antd_1.Form, { form: form, onFinish: handleLogin, layout: "inline", style: { margin: 0 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "phone", rules: [{ required: true, message: 'Please enter your phone number' }], style: { margin: 0 }, children: (0, jsx_runtime_1.jsx)(AntPhoneInput, { placeholder: "Phone number", size: "large", style: { width: 200 } }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "password", rules: [{ required: true, message: 'Please enter your password' }], style: { margin: 0 }, children: (0, jsx_runtime_1.jsx)(antd_1.Input.Password, { placeholder: "Password", prefix: (0, jsx_runtime_1.jsx)(icons_1.LockOutlined, {}), size: "large", style: { width: 150 } }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { style: { margin: 0 }, children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", loading: isLoading, size: "large", children: "Login" }) })] })] }));
};
exports.default = LoginForm;
//# sourceMappingURL=LoginForm.js.map