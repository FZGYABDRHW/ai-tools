import React, { createContext, useState, ReactNode } from 'react';

interface SidebarContextType {
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    hideSidebar: () => void;
    showSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
    isSidebarVisible: true,
    toggleSidebar: () => {},
    hideSidebar: () => {},
    showSidebar: () => {}
});

interface SidebarProviderProps {
    children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const hideSidebar = () => {
        setIsSidebarVisible(false);
    };

    const showSidebar = () => {
        setIsSidebarVisible(true);
    };

    return (
        <SidebarContext.Provider value={{
            isSidebarVisible,
            toggleSidebar,
            hideSidebar,
            showSidebar
        }}>
            {children}
        </SidebarContext.Provider>
    );
};
