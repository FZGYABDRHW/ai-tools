# AI Tools

A modern Electron application for building task text prompts and generating custom operational reports.

## Features

- **AI Task Builder**: Generate text prompts for tasks using Task ID and Auth Token
- **Custom Operational Report**: Create and generate custom operational reports
- **Modern UI**: Built with Ant Design for a professional and responsive interface
- **Real-time Feedback**: Toast notifications for user actions
- **Persistent Storage**: Local storage for form data and authentication tokens

## UI Improvements

The application has been completely redesigned using **Ant Design** components:

### Components Used
- **Layout**: Professional sidebar navigation with header
- **Form**: Structured form inputs with validation
- **Button**: Modern buttons with loading states and icons
- **Card**: Clean content containers with shadows
- **Typography**: Consistent text hierarchy
- **Space**: Proper spacing and alignment
- **Divider**: Visual separation between sections
- **Message**: Toast notifications for user feedback
- **Icons**: Ant Design icons for better visual communication

### Key Features
- **Responsive Design**: Works well on different screen sizes
- **Professional Navigation**: Sidebar with active state indicators
- **Form Validation**: Built-in validation with error messages
- **Loading States**: Visual feedback during async operations
- **Copy to Clipboard**: One-click copying with success feedback
- **Theme Consistency**: Unified color scheme and styling

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

## Building

```bash
npm run package
```

## Dependencies

- **React 18**: Modern React with hooks
- **Ant Design**: UI component library
- **React Router**: Client-side routing
- **Electron**: Desktop application framework
- **TypeScript**: Type-safe JavaScript

## Project Structure

```
src/
├── app.tsx                    # Main entry point
├── index.css                  # Global styles
├── index.html                 # HTML template
├── builder.ts                 # Task text building logic
├── reportBuilder.ts           # Report generation logic
├── serviceInit.ts             # Service initialization
├── taskIterator.ts            # Task iteration utilities
├── types/
│   └── index.ts              # TypeScript type definitions
├── contexts/
│   └── AuthContext.tsx       # Authentication context provider
├── components/
│   ├── index.ts              # Component exports
│   ├── App.tsx               # Main application component
│   ├── Navigation.tsx        # Sidebar navigation
│   ├── Header.tsx            # Top header with auth token
│   ├── TokenInput.tsx        # Auth token input component
│   ├── TaskAuthForm.tsx      # Task text builder form
│   └── CustomOperationalReport.tsx # Custom report component
└── api-client/               # API client services
```

## Architecture

The application follows a clean, modular architecture:

### **Components**
- **App**: Main application wrapper with routing and providers
- **Navigation**: Sidebar navigation with menu items
- **Header**: Top header with branding and auth token input
- **TokenInput**: Reusable auth token input with status indicator
- **TaskAuthForm**: Task text builder functionality
- **CustomOperationalReport**: Custom report generation

### **Contexts**
- **AuthContext**: Manages authentication state and localStorage persistence

### **Types**
- **AuthContextType**: TypeScript interface for authentication context

### **Benefits of Refactoring**
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be easily reused across the application
- **Maintainability**: Easier to maintain and update individual components
- **Testability**: Components can be tested in isolation
- **Scalability**: Easy to add new features and components

## Usage

1. **AI Task Builder**:
   - Enter your Auth Token in the header
   - Navigate to "AI Task Builder"
   - Enter a Task ID
   - Click "Build Text for Prompt"
   - Copy the generated text to clipboard

2. **Custom Operational Report**:
   - Navigate to "Custom Operational Report"
   - Enter your report content in the text area
   - Click "Generate Custom Report" or "Preview Report"
   - View the generated report below

## UI Components

### Navigation
- Sidebar with application title
- Menu items with icons
- Active state highlighting

### Forms
- Structured form layout
- Required field validation
- Placeholder text for guidance
- Large input sizes for better UX

### Buttons
- Primary actions with blue styling
- Loading states with spinners
- Icons for visual context
- Disabled states for invalid inputs

### Feedback
- Success messages for completed actions
- Error messages for failed operations
- Loading indicators during processing
- Toast notifications for user actions
