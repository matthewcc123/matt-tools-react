import {
	createContext,
	useContext,
} from "react";
import { type ModalResult } from "../components/Modal";

export interface ModalOptions {
	title?: string;
	body?: React.JSX.Element;
	primaryText?: string;
	secondaryText?: string;
	tertiaryText?: string;
}

export type ModalContextType = {
	ShowModal: (newOptions: ModalOptions) => Promise<ModalResult>;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export function useModalService() {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error(
			"useModalService must be used within a ModalContextProvider",
		);
	}

	return context;
}
