import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ open, setOpen }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export function Modal({ children }) {
    return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
    children,
    className,
    as: Component = 'button',
}) => {
    const { setOpen } = useModal();

    return (
        <Component className={cn(className)} onClick={() => setOpen(true)}>
            {children}
        </Component>
    );
};

export const ModalBody = ({
    title = '',
    children,
    className,
    status = false,
    setStatus = () => {},
    onClose = () => {},
    onClickOutside = true,
}) => {
    const { open, setOpen } = useModal();
    useEffect(() => {
        setOpen(status);
    }, [status]);

    useEffect(() => {
        setStatus(open);
    }, [open]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [open]);

    const modalRef = useRef(null);

    onClickOutside &&
        useOutsideClick(modalRef, e => {
            e.preventDefault();
            setOpen(false);
            onClose();
        });

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        backdropFilter: 'blur(10px)',
                    }}
                    exit={{
                        opacity: 0,
                        backdropFilter: 'blur(0px)',
                    }}
                    className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0  h-full w-full flex items-center justify-center z-50"
                >
                    <Overlay />

                    <motion.div
                        // onClick={() => onClose()}
                        ref={modalRef}
                        className={cn(
                            ' max-h-[90%] md:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-x-hidden',
                            className
                        )}
                        initial={{
                            opacity: 0,
                            scale: 0.5,
                            rotateX: 40,
                            y: 40,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotateX: 0,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            rotateX: 10,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 15,
                        }}
                    >
                        <Title title={title} />
                        <CloseIcon onClose={onClose} className="mx-4" />

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const ModalContent = ({ children, className }) => {
    return (
        <div
            className={cn(
                'flex flex-col flex-1 px-2 md:px-4 mt-14 mb-2  overflow-auto',
                className
            )}
        >
            {children}
        </div>
    );
};

export const ModalFooter = ({ children, className }) => {
    return (
        <div
            className={cn(
                'flex justify-end p-4 bg-gray-100 dark:bg-neutral-900',
                className
            )}
        >
            {children}
        </div>
    );
};

const Overlay = ({ className }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                backdropFilter: 'blur(10px)',
            }}
            exit={{
                opacity: 0,
                backdropFilter: 'blur(0px)',
            }}
            className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
        ></motion.div>
    );
};

const CloseIcon = ({ onClose }) => {
    const { setOpen } = useModal();
    return (
        <button
            onClick={e => {
                e.preventDefault();
                setOpen(false);
                onClose();
            }}
            className="absolute top-4 right-4 group"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
            </svg>
        </button>
    );
};

const Title = ({ title }) => {
    return (
        <h2 className="absolute top-2 left-4 text-lg sm:text-xl font-bold">
            {title}
        </h2>
    );
};

// Hook to detect clicks outside of a component.
export const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const listener = event => {
            // DO NOTHING if the element being clicked is the target element or their children
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            callback(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, callback]);
};
