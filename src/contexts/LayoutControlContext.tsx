import {createContext, useContext, useState} from "react";

type LayoutControlContextType = {
    navbarOpened: boolean;
    setNavbarOpened: (opened: boolean) => void;
}

const LayoutControlContext = createContext<LayoutControlContextType>({
    navbarOpened: false,
    setNavbarOpened: () => {},
});

export function LayoutControlProvider({ children }: any) {
    const [navbarOpened, setNavbarOpened] = useState<boolean>(false);

    return (
        <LayoutControlContext.Provider value={{
            navbarOpened,
            setNavbarOpened
        }}>
            {children}
        </LayoutControlContext.Provider>
    );

}


export function useLayoutControl() {
    return useContext(LayoutControlContext);
}
