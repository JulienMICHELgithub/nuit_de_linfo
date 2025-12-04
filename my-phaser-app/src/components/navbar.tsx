import Logo from "@/components/navbar-components/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { active: true, href: "/", label: "Home" },
  { href: "/game", label: "Game" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 border-b border-white/20 backdrop-blur-xl bg-black/30">
            <div className="flex h-16 justify-between gap-4">
                {/* Left side */}
                <div className="flex gap-2">
                    <div className="flex items-center md:hidden">
                        {/* Mobile menu trigger */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="group size-8" size="icon" variant="ghost">
                                    <svg
                                        className="pointer-events-none text-white"
                                        fill="none"
                                        height={16}
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width={16}
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                                            d="M4 12L20 12"
                                        />
                                        <path
                                            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                                            d="M4 12H20"
                                        />
                                        <path
                                            className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                                            d="M4 12H20"
                                        />
                                    </svg>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className="w-36 p-1 md:hidden bg-black/90 border-white/20 backdrop-blur-xl"
                            >
                                <NavigationMenu className="max-w-none *:w-full">
                                    <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                                        {navigationLinks.map((link, index) => (
                                            <NavigationMenuItem className="w-full" key={String(index)}>
                                                <NavigationMenuLink
                                                    active={link.active}
                                                    className="py-1.5 text-white hover:text-white/90"
                                                    href={link.href}
                                                >
                                                    {link.label}
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Main nav */}
                    <div className="flex items-center gap-6">
                        <a className="text-white hover:text-white/90" href="#">
                            <Logo />
                        </a>
                        {/* Navigation menu */}
                        <NavigationMenu className="h-full *:h-full max-md:hidden">
                            <NavigationMenuList className="h-full gap-2">
                                {navigationLinks.map((link, index) => (
                                    <NavigationMenuItem className="h-full" key={String(index)}>
                                        <NavigationMenuLink
                                            active={link.active}
                                            className="h-full justify-center rounded-none border-transparent border-y-2 border-b-white py-1.5 font-medium text-white/80 hover:border-b-white hover:bg-white/10 hover:text-white data-[active]:border-b-white data-[active]:bg-white/20 data-[active]:text-white"
                                            href={link.href}
                                        >
                                            {link.label}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
                {/* Right side */}
                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        className="text-sm text-white hover:text-white/90 hover:bg-white/10 border-white/20"
                        size="sm"
                        variant="ghost"
                    >
                        <a href="/signin">Sign In</a>
                    </Button>
                </div>
            </div>
        </header>
    );
}
