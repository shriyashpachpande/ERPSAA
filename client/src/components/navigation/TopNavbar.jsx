import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronRight, ChevronDown } from 'lucide-react';

const TopNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAboutDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 100);
  };

  const aboutLinks = [
    { name: 'About Us', path: '/about/us' },
    { name: 'Vision Mission', path: '/about/vision-mission' },
    { name: 'Core values & Ethics', path: '/about/core-values' },
    { name: 'Accreditations', path: '/about/accreditations' },
    { name: 'Cells & Committees', path: '/about/cells-committees' },
    { name: 'Chairman\'s Desk', path: '/about/leadership' },
    { name: 'Director\'s Desk', path: '/about/leadership' },
    { name: 'Courses Offered', path: '/about/courses' },
    { name: 'History', path: '/about/history' },
    { name: 'Governing Council', path: '/about/governing-council' },
    { name: 'Press Coverage', path: '/about/press' },
    { name: 'Location', path: '/about/location' },
    { name: 'Service Rules', path: '/about/service-rules' }

  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${isScrolled ? 'pt-4' : 'pt-6'
      }`}>
      <div className={`max-w-6xl mx-auto transition-all duration-500 rounded-2xl ${isScrolled
        ? 'bg-transparent backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgb(0,0,0,0.03)] px-6 py-3'
        : 'bg-transparent backdrop-blur-sm border border-white/5 px-6 py-4'
        } flex items-center justify-between`}
        style={{ boxShadow: "0 0 20px 0px rgba(59, 130, 246, 0.5)" }}
      >

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-brand-dark flex items-center group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-brand-accent flex items-center justify-center mr-2 shadow-sm transform group-hover:scale-105 transition-transform">
            <span className="text-white text-sm">E</span>
          </div>
          ERPSAA<span className="text-primary-500"></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-gray-50/50 p-1 rounded-full border border-gray-100/50">
          <Link
            to="/#features"
            className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-100 transition-all"
          >
            Features
          </Link>

          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${aboutDropdownOpen ? 'text-brand-dark bg-white shadow-sm ring-1 ring-gray-100' : 'text-gray-600 hover:text-brand-dark hover:bg-white'}`}>
              <span>About</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl transition-all duration-300 origin-top-left ${aboutDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="p-2 space-y-1">
                {aboutLinks.map((link) => (
                  link.name === 'Cells & Committees' ? (
                    <div key={link.name} className="relative group/nested">
                      <div className="px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all flex items-center justify-between cursor-pointer">
                        {link.name}
                        <ChevronRight className="w-3 h-3" />
                      </div>

                      {/* NESTED FLYOUT MENU - Overlap Bridge Fix (With Click Fix) */}
                      <div className="absolute left-[95%] top-0 w-80 pl-10 opacity-0 scale-95 pointer-events-none group-hover/nested:opacity-100 group-hover/nested:scale-100 group-hover/nested:pointer-events-auto transition-all duration-300 origin-top-left z-50">
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                          {[
                            { n: 'Academic Cell', id: 'academic-cell' },
                            { n: 'Admission Cell', id: 'admission-cell' },
                            { n: 'Anti Ragging Squad', id: 'anti-ragging-squad' },
                            { n: 'Anti Ragging Committee', id: 'anti-ragging-committee' },
                            { n: 'CASERP Cell', id: 'caserp-cell' },
                            { n: 'College Development Committee', id: 'cdc' },
                            { n: 'Cultural Committee', id: 'cultural' },
                            { n: 'Examination Cell', id: 'exam-cell' },
                            { n: 'Internal Complaint Committee - ICC', id: 'icc' },
                            { n: 'SC_ST Cell', id: 'sc-st-cell' },
                            { n: 'Student Grievance Redressal (SGRC)', id: 'sgrc' },
                            { n: 'Training and Placement Cell', id: 'placement-cell' }
                          ].map((cell) => (
                            <Link
                              key={cell.id}
                              to={`/about/cells-committees/${cell.id}`}
                              className="px-4 py-2 text-[13px] text-gray-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all block font-bold mb-0.5 last:mb-0"
                              onClick={() => {
                                setAboutDropdownOpen(false);
                                setMobileMenuOpen(false);
                              }}
                            >
                              {cell.n}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-brand-dark hover:bg-gray-50 rounded-xl transition-all flex items-center justify-between group"
                      onClick={() => setAboutDropdownOpen(false)}
                    >
                      {link.name}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform translate-x-[-5px] group-hover:translate-x-0 transition-all" />
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/#workflow"
            className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-100 transition-all"
          >
            Workflow
          </Link>
          <Link
            to="/collegeprofile"
            className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-100 transition-all"
          >
            Academics
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link to="/login" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-brand-dark text-white hover:bg-black transition-all shadow-[0_0_20px_rgba(15,23,42,0.15)] hover:shadow-[0_0_25px_rgba(15,23,42,0.25)] flex items-center group relative overflow-hidden">
            <span className="relative z-10 flex items-center">
              Login Portal <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-dark p-2 -mr-2 rounded-lg hover:bg-gray-100/50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-40 transition-transform duration-500 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden flex flex-col pt-32 px-8`}>
        <div className="flex flex-col space-y-6 text-2xl font-semibold tracking-tight">
          {['Features', 'About', 'Workflow', 'Academics'].map((item) => (
            <Link
              key={item}
              to={item === 'Academics' ? '/collegeprofile' : `/#${item.toLowerCase()}`}
              className="text-gray-900 border-b border-gray-100 pb-4 flex items-center justify-between group"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-2 transition-all" />
            </Link>
          ))}
          <Link
            to="/login"
            className="mt-8 bg-brand-dark text-white px-6 py-4 rounded-2xl text-lg font-medium flex items-center justify-center shadow-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            Access Portal
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
