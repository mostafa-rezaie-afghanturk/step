import { cn } from '@/lib/utils';
import React, { useState, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTour } from '@/context/TourProvider';

const SidebarContext = createContext();

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = false,
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
    return (
        <>
            <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
                {children}
            </SidebarProvider>
        </>
    );
};

export const SidebarBody = props => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...props} />
        </>
    );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <>
            <motion.div
                className={cn(
                    'px-4  hidden h-screen  md:flex md:flex-col bg-white dark:bg-neutral-800 w-[300px] flex-shrink-0',
                    className
                )}
                animate={{
                    width: animate ? (open ? '250px' : '60px') : '250px',
                }}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                {...props}
            >
                <div className="h-screen fixed w-[220px]">{children}</div>
            </motion.div>
        </>
    );
};

export const MobileSidebar = ({ className, children, ...props }) => {
    const { open, setOpen } = useSidebar();
    return (
        <>
            <div
                className={cn(
                    'h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-white dark:bg-neutral-800 w-full'
                )}
                {...props}
            >
                <div className="flex justify-end z-20 w-full">
                    <IconMenu2
                        className="text-neutral-800 dark:text-neutral-200"
                        onClick={() => setOpen(!open)}
                    />
                </div>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeInOut',
                            }}
                            className={cn(
                                'fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between',
                                className
                            )}
                        >
                            <div
                                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                                onClick={() => setOpen(!open)}
                            >
                                <IconX />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export const SidebarLink = ({ link, className, ...props }) => {
    const { open, animate } = useSidebar();
    const { url } = usePage();

    if (link.href === route('logout')) {
        return (
            <button
                onClick={e => {
                    e.preventDefault();
                    router.post(route('logout'));
                }}
                className={cn(
                    'flex items-center justify-start gap-2 group/sidebar py-2',
                    className
                )}
            >
                {link.icon}
                <motion.span
                    animate={{
                        display: animate
                            ? open
                                ? 'inline-block'
                                : 'none'
                            : 'inline-block',
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    className="text-neutral-700   dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                >
                    {link.label}
                </motion.span>
            </button>
        );
    }

    if (link.children) {
        const isChildActive = link.children.some(child => url.includes(child.href));

        return (
            <Disclosure defaultOpen={isChildActive}>
                <DisclosureButton
                    id={link.id}
                    className={cn(
                        'group flex items-center justify-start gap-2  group/sidebar py-2 ',
                        className
                    )}
                >
                    <span
                        style={{ color: url.includes(link.href) && '#00ADBB' }}
                        className="text-zinc-500 dark:text-neutral-200"
                    >
                        {link.icon}
                    </span>

                    <motion.span
                        animate={{
                            display: animate
                                ? open
                                    ? 'inline-block'
                                    : 'none'
                                : 'inline-block',
                            opacity: animate ? (open ? 1 : 0) : 1,
                        }}
                        style={{ color: url.includes(link.href) && '#00ADBB' }}
                        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 rtl:group-hover/sidebar:-translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                    >
                        {link.label}
                    </motion.span>
                    <ChevronDownIcon
                        style={{ fill: url.includes(link.href) && '#00ADBB' }}
                        className="size-5 fill-black/60 group-data-[hover]:fill-black/50 group-data-[open]:rotate-180 ml-auto"
                    />
                </DisclosureButton>
                <DisclosurePanel className="text-gray-500 ps-4">
                    {link.children.map((child, index) => (
                        <Link
                            key={index}
                            href={child.href}
                            className={cn(
                                'flex items-center justify-start gap-2  group/sidebar py-2 ',
                                className
                            )}
                            {...props}
                        >
                            <span
                                style={{
                                    color:
                                        url.includes(child.href) && '#00ADBB',
                                }}
                                className="text-zinc-500 dark:text-neutral-200"
                            >
                                {child.icon}
                            </span>

                            <motion.span
                                animate={{
                                    display: animate
                                        ? open
                                            ? 'inline-block'
                                            : 'none'
                                        : 'inline-block',
                                    opacity: animate ? (open ? 1 : 0) : 1,
                                }}
                                style={{
                                    color:
                                        url.includes(child.href) && '#00ADBB',
                                }}
                                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 rtl:group-hover/sidebar:-translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                            >
                                {child.label}
                            </motion.span>
                        </Link>
                    ))}
                </DisclosurePanel>
            </Disclosure>
        );
    } else {
        return (
            <Link
                href={link.href}
                id={link.id}
                className={cn(
                    'flex items-center justify-start gap-2  group/sidebar py-2 ',
                    className
                )}
                {...props}
            >
                <span
                    style={{ color: url.includes(link.href) && '#00ADBB' }}
                    className="text-zinc-500 dark:text-neutral-200"
                >
                    {link.icon}
                </span>

                <motion.span
                    animate={{
                        display: animate
                            ? open
                                ? 'inline-block'
                                : 'none'
                            : 'inline-block',
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    style={{ color: url.includes(link.href) && '#00ADBB' }}
                    className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 rtl:group-hover/sidebar:-translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                >
                    {link.label}
                </motion.span>
            </Link>
        );
    }
};
