import { Button } from '@headlessui/react';
import { Link, Head } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { hasPermission } = usePermission();

    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const langs = [
        {
            id: 'ar',
            name: 'AR',
        },
        {
            id: 'az',
            name: 'AZ',
        },
        {
            id: 'en',
            name: 'EN',
        },
        {
            id: 'fr',
            name: 'FR',
        },
        {
            id: 'fa',
            name: 'FA',
        },
        {
            id: 'So',
            name: 'SO',
        },
        {
            id: 'es',
            name: 'ES',
        },
        {
            id: 'tr',
            name: 'TR',
        },
    ];

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen">
                {/* Left Side (Image and Branding) */}

                <div className="hidden lg:flex  flex-col items-center justify-center relative overflow-hidden w-1/2">
                    <div className="absolute top-0 left-0 h-screen w-9/12 bg-[#115DAB] z-0"></div>
                    {/* Top Circle */}
                    <div className="absolute top-[-70px] left-[-70px] md:w-5/12 xl:w-4/12  aspect-square bg-[#203E7A] rounded-full z-0"></div>

                    {/* Bottom Circle */}
                    <div className="absolute bottom-[-60px] left-[-100px] md:w-5/12 xl:w-4/12  aspect-square bg-[#D37943] rounded-full z-0"></div>

                    <div className="absolute top-0 left-1/4 ">
                        <img
                            src="/assets/maarif_logo.svg"
                            alt="Logo"
                            className="w-8/12"
                        />
                    </div>

                    <div className="relative w-full"></div>
                </div>
                <div>
                    <img
                        src="/assets/login_library_logo.svg"
                        alt="Library Illustration"
                        className="
                        hidden lg:block
                        absolute
                         top-0 bottom-0 left-0 
                        drop-shadow-lg 
                        w-4/12 h-screen 
                       "
                    />
                </div>

                <div className="flex flex-col gap-28 w-full lg:w-full px-8 lg:px-24">
                    {/* Language Selection */}
                    <div className="mt-4 flex justify-end space-x-2  text-sm">
                        {langs.map(langs => {
                            return (
                                <Button key={langs.id} className="underline">
                                    {langs.name}
                                </Button>
                            );
                        })}
                        {/* <a href="#" className="underline">
                            AR
                        </a>
                        <a href="#" className="underline">
                            AZ
                        </a>
                        <a href="#" className="underline">
                            EN
                        </a>
                        <a href="#" className="underline">
                            FR
                        </a>
                        <a href="#" className="underline">
                            FA
                        </a>
                        <a href="#" className="underline">
                            SO
                        </a>
                        <a href="#" className="underline">
                            ES
                        </a>
                        <a href="#" className="underline">
                            TR */}
                        {/* </a> */}
                    </div>
                    {/* Right Side (Login Form) */}
                    <div className="flex flex-col items-center justify-center w-full lg:w-full px-8 lg:px-24">
                        <div className="w-full max-w-md">
                            <h2 className="text-xl font-semibold text-[#115DAB] mb-14 text-center">
                                Log in
                            </h2>
                            <form
                                action="#"
                                method="POST"
                                className="space-y-6"
                            >
                                <div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="User name or email*"
                                        required
                                        className="w-full border-none bg-[#CBE5F6] px-4 py-2 mt-1 placeholder-[#0856A8] focus:ring focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <input
                                        id="password"
                                        name="password"
                                        placeholder="password"
                                        type="password"
                                        required
                                        className="w-full border-none px-4 bg-[#CBE5F6] py-2 mt-1 placeholder-[#0856A8] focus:ring focus:ring-blue-300"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4   text-[#115DAB] focus:ring-[#115DAB]  border-[#115DAB] "
                                        />
                                        <label
                                            htmlFor="remember-me"
                                            className="ml-2 block text-sm text-[#115DAB]"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <div> </div>
                                <div className="text-sm flex items-center justify-between">
                                    <a
                                        href="#"
                                        className="font-medium text-[#115DAB] hover:text-blue-500"
                                    >
                                        Forgot Password?
                                    </a>

                                    <button
                                        type="submit"
                                        className=" bg-[#115DAB] text-white px-4 py-2 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Log in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
