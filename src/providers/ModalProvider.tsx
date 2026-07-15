import { useRef, useState, type ReactNode } from "react";
import Modal, { type ModalResult } from "../components/Modal";
import { ModalContext, type ModalContextType, type ModalOptions } from "../contexts/ModalContext";

export function ModalProvider({ children }: { children: ReactNode }) {
    const [options, setOptions] = useState<ModalOptions>({});
    const [isOpen, setOpen] = useState(false);

    const resolverRef = useRef<(result: ModalResult) => void | null>(null);

    const showModal = (newOptions: ModalOptions) => {
        if (isOpen) {
            throw new Error("Modal is still opened");
        }

        setOptions(newOptions);
        setOpen(true);

        return new Promise<ModalResult>((resolve) => {
            resolverRef.current = resolve;
        });
    };

    const handleClose = (result: ModalResult) => {
        setOpen(false);

        resolverRef.current?.(result);
        resolverRef.current = null;
    };

    const value: ModalContextType = {
        ShowModal: showModal,
    };

    return (
        <ModalContext.Provider value={value}>
            <Modal
                title={options.title}
                body={options.body}
                primaryText={options.primaryText}
                secondaryText={options.secondaryText}
                tertiaryText={options.tertiaryText}
                isOpen={isOpen}
                onClose={handleClose}
            />
            {children}
        </ModalContext.Provider>
    );
}
