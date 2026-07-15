import { AnimatePresence, easeOut, motion } from "framer-motion";
import type React from "react";

export type ModalResult = "primary" | "secondary" | "tertiary" | "none";

export interface ModalProps {
	isOpen: boolean;
	onClose: (result: ModalResult) => void;
	title?: string;
	body?: React.JSX.Element;
	primaryText?: string;
	secondaryText?: string;
	tertiaryText?: string;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	body,
	primaryText = "Confirm",
	secondaryText,
	tertiaryText,
}: ModalProps) {
	const singleButton =
		[primaryText, secondaryText, tertiaryText].filter(
			(text) => text !== null && text !== undefined,
		).length === 1;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key={"backdrop"}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2, ease: easeOut }}
					className="fixed flex justify-center pt-[32vh] z-50 min-w-screen min-h-screen inset-0 bg-black/30 backdrop-blur-xs"
				>
					<motion.div
						key={"card"}
						initial={{ opacity: 0, scale: 1.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.1 }}
						transition={{ duration: 0.1, ease: easeOut }}
						className="origin-center card flex flex-col justify-between rounded-md min-w-90 max-w-xl h-fit max-h-screen shadow-md"
					>
						<div className="p-6 pb-3">
							<p className="font-medium text-xl ">{title}</p>
						</div>
						<div className="flex-1 p-6 pt-0 overflow-auto scrollbar-thin">
							{body}
						</div>
						<div className="bg-secondary p-6 flex justify-end gap-2">
							{primaryText != null ? (
								<button
									className={`${singleButton ? "w-[50%]" : "w-full"} button-primary`}
									onClick={() => {
										onClose("primary");
									}}
								>
									{primaryText}
								</button>
							) : null}
							{secondaryText != null ? (
								<button
									className={`${singleButton ? "w-[50%]" : "w-full"} button`}
									onClick={() => {
										onClose("secondary");
									}}
								>
									{secondaryText}
								</button>
							) : null}
							{tertiaryText != null ? (
								<button
									className={`${singleButton ? "w-[50%]" : "w-full"} button`}
									onClick={() => {
										onClose("tertiary");
									}}
								>
									{tertiaryText}
								</button>
							) : null}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
