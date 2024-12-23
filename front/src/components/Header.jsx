import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import logoWhite from '../assets/Horizontal_blanco.webp';
import logoBlack from '../assets/Horizontal_negro.webp';
import Menu from './Menu';

const Header = ({ txt }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <header className="flex flex-col items-center justify-between pt-7 pb-4 px-6 bg-hero-image bg-cover bg-bottom md:bg-none md:max-w-7xl md:mx-auto">
            <nav className="self-end md:flex md:justify-between md:mb-5 md:w-11/12 md:mx-auto">
                <a href="/" className="max-md:hidden">
                    <img src={logoBlack} alt="logo" className="max-w-36" />
                </a>
                <section className="MOBILE-MENU flex md:hidden">
                    <div
                        className="HAMBURGER-ICON space-y-1.5"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                    >
                        <RxHamburgerMenu className="text-3xl cursor-pointer text-white" />
                    </div>

                    <div
                        className={
                            isNavOpen
                                ? 'flex fixed w-full h-screen top-0 left-0 bg-white z-20 flex-col items-center justify-evenly'
                                : 'hidden'
                        }
                    >
                        <div
                            className="absolute top-0 right-0 px-8 py-8"
                            onClick={() => setIsNavOpen(false)}
                        >
                            <IoClose className="text-3xl cursor-pointer" />
                        </div>
                        <div className="flex flex-col items-center justify-between min-h-[250px]">
                            <Menu />
                        </div>
                    </div>
                </section>

                <div className="DESKTOP-MENU hidden space-x-6 md:flex md:items-baseline lg:space-x-10">
                    <Menu />
                </div>
            </nav>
            <hr className="w-full max-md:hidden" />
            <a href="/" className="mt-6 md:hidden">
                <img src={logoWhite} alt="logo" className="max-w-48" />
            </a>
            {txt ? (
                <h1 className="text-white mt-5 mb-4 text-2xl/8 font-semibold text-center w-4/5 md:text-black md:mt-12">
                    {txt}
                </h1>
            ) : (
                ''
            )}

            {txt ? (
                <span className="relative w-full md:hidden">
                    <span
                        className="block absolute bg-yellowOiches w-6 h-2 bottom-0 right-0"
                        aria-hidden="true"
                    ></span>
                    <span
                        className="block absolute bg-yellowOiches w-2 h-6 bottom-0 right-0"
                        aria-hidden="true"
                    ></span>
                </span>
            ) : (
                ''
            )}
        </header>
    );
};

export default Header;
