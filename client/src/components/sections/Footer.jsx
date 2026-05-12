import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tight text-brand-dark mb-6 inline-block">
              ERPSAA<span className="text-primary-500">.</span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-6 leading-relaxed font-medium">
              The premier comprehensive operational platform for next-generation universities and colleges. Engineered for scale.
            </p>
            <div className="flex space-x-4">
               <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-colors cursor-pointer">
                 <span className="font-bold text-sm">X</span>
               </div>
               <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-colors cursor-pointer">
                 <span className="font-bold text-sm">in</span>
               </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-gray-900">Platform Features</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#modules" className="hover:text-primary-600 transition-colors">Admissions Engine</a></li>
              <li><a href="#modules" className="hover:text-primary-600 transition-colors">Student Identity</a></li>
              <li><a href="#modules" className="hover:text-primary-600 transition-colors">Treasury & Fees</a></li>
              <li><a href="#workflow" className="hover:text-primary-600 transition-colors">Automated Workflows</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-gray-900">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-primary-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Customer Stories</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-gray-900">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Data Security</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium text-gray-400">
          <p>© 2026 ERPSAA Digital Campus. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
