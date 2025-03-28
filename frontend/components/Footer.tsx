import React from "react";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-6 md:mb-0">
                        <Image
                            width={40}
                            height={30}
                            src="/logo.png"
                            alt="RevoeAI Logo"
                        />
                        <span className="text-xl font-bold ml-2">revoeAI</span>
                    </div>
                    <div className="flex flex-wrap gap-8">
                        <a href="#" className="hover:text-accent">
                            Features
                        </a>
                        <a href="#" className="hover:text-accent">
                            Pricing
                        </a>
                        <a href="#" className="hover:text-accent">
                            Documentation
                        </a>
                        <a href="#" className="hover:text-accent">
                            About Us
                        </a>
                        <a href="#" className="hover:text-accent">
                            Contact
                        </a>
                    </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 text-center text-muted-secondary">
                    <p>© 2025 RevoeAI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
