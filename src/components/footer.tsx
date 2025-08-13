import ContactForm from "./contact-email";

export default function Footer() {
    const projects = [
        { name: "Web Development", href: "http://localhost:3000/portofolio", section: "web-dev" },
        { name: "Mobile Apps", href: "http://localhost:3000/portofolio", section: "mobile-apps" },
        { name: "UI/UX", href: "http://localhost:3000/portofolio", section: "ui-ux" },
        { name: "Data Science", href: "http://localhost:3000/portofolio", section: "data-science" }
    ];

    const socialLinks = [
        { 
            name: "GitHub", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 30 30">
                    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
            ),
            href: "https://github.com/Alpucap",
            color: "hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-purple-400/50"
        },
        { 
            name: "LinkedIn", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 50 50">
                    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
                </svg>
            ),
            href: "https://linkedin.com/in/yourusername",
            color: "hover:bg-blue-500/20 hover:border-blue-400 hover:shadow-blue-400/50"
        },
        { 
            name: "Instagram", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 50 50">
                    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
                </svg>
            ),
            href: "https://www.instagram.com/hnscns/",
            color: "hover:bg-sky-500/20 hover:border-sky-400 hover:shadow-sky-400/50"
        },
        { 
            name: "Email", 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 24 24">
                    <path d="M18,21h2c1.65,0,3-1.35,3-3V9.92l-6,4.68V20C17,20.552,17.448,21,18,21z M19.5,3c-0.79,0-1.54,0.26-2.16,0.74L17,4.01v8.06	l6-4.69V6.5C23,4.57,21.43,3,19.5,3z M9,5.57v8.06l2.385,1.86c0.362,0.282,0.869,0.282,1.23,0L15,13.63V5.57l-3,2.34L9,5.57z M1,18	c0,1.65,1.35,3,3,3h2c0.552,0,1-0.448,1-1v-5.4L1,9.92V18z M4.5,3C2.57,3,1,4.57,1,6.5v0.88l6,4.69V4.01L6.66,3.74	C6.04,3.26,5.29,3,4.5,3z"></path>
                </svg>
            ),
            href: "mailto:alpucaps@google.com",
            color: "hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-emerald-400/50"
        }
    ];

    const handleProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
        e.preventDefault();
        const projectsElement = document.getElementById('projects');
        if (projectsElement) {
            projectsElement.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const specificSection = document.querySelector(`[data-project="${section}"]`);
                if (specificSection) {
                    specificSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 800);
        }
    };

    const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('mailto:')) {
            return;
        }
        if (href.startsWith('http')) {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <footer id="contact" className="bg-gray-900 text-gray-100 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">Hans Christian Handoto</h3>
                        <div className="w-16 h-1 bg-blue-400 mb-4"></div>
                        <p className="text-gray-400 text-lg max-w-md">
                            Passionate software engineer dedicated to creating innovative solutions that bridge technology, art, and human needs.
                        </p>
                    </div>
                    <ContactForm />
                </div>

                <div className="space-y-10">
                    <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Projects</h4>
                        <div className="w-12 h-1 bg-blue-400 mb-4"></div>
                        <nav aria-label="Project navigation">
                            <ul className="space-y-2">
                                {projects.map((project) => (
                                    <li key={project.name}>
                                        <a
                                            href={project.href}
                                            onClick={(e) => handleProjectClick(e, project.section)}
                                            className="text-gray-400 flex items-center hover:text-blue-400 transition-all duration-200 cursor-pointer group focus:outline-none focus:text-blue-300 focus:bg-blue-500/10 focus:border-l-2 focus:border-blue-400 focus:pl-2 focus:-ml-2 rounded-r-md py-1"
                                            aria-label={`Navigate to ${project.name} section`}
                                        >
                                            <span className="text-blue-400 mr-2 group-hover:text-blue-300 transition-colors duration-200" aria-hidden="true">•</span> 
                                            {project.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Connect</h4>
                        <div className="w-12 h-1 bg-blue-400 mb-4"></div>
                        
                        {/* Enhanced Social Links Design */}
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((social, index) => (
                                <div key={social.name} className="group relative">
                                    <a
                                        href={social.href}
                                        onClick={(e) => handleSocialClick(e, social.href)}
                                        className={`
                                            relative w-12 h-12 rounded-lg flex items-center justify-center 
                                            bg-gray-800/50 backdrop-blur-sm border border-gray-700/50
                                            transition-all duration-300 ease-out
                                            hover:scale-110 hover:rotate-3 hover:shadow-lg
                                            ${social.color}
                                            before:absolute before:inset-0 before:rounded-xl 
                                            before:bg-gradient-to-br before:from-white/5 before:to-transparent
                                            before:opacity-0 hover:before:opacity-100 before:transition-opacity
                                            after:absolute after:inset-0 after:rounded-xl
                                            after:bg-gradient-to-t after:from-black/20 after:to-transparent
                                        `}
                                        title={social.name}
                                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <span className="relative z-10 transition-all duration-300 group-hover:scale-110 text-gray-300 group-hover:text-white">
                                            {social.icon}
                                        </span>
                                        
                                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute inset-2 rounded-lg bg-white/10 animate-ping"></div>
                                        </div>
                                    </a>
                                    
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-gray-700 shadow-lg">
                                        {social.name}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 border-r border-b border-gray-700 rotate-45 -mt-1"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800 mt-16 pt-6 text-sm text-gray-400 text-center md:text-left md:flex md:justify-between md:items-center px-6">
                <p>© 2025 Hans Christian Handoto. All rights reserved.</p>
                <div className="flex justify-center md:justify-end space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}