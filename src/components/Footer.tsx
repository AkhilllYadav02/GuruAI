
import { Heart, Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7V10C2 16 6 20.9 12 22C18 20.9 22 16 22 10V7L12 2Z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">EduMentor AI</h3>
            </div>
            <p className="text-gray-300 text-sm sm:text-base mb-4 max-w-md">
              Revolutionizing education with AI-powered learning. Your intelligent study companion for better learning outcomes.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by</span>
              <span className="font-semibold text-blue-400">Mindexa</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact Information - Enhanced */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contact Us</h4>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-3 rounded-lg border border-blue-500/30">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400 animate-pulse" />
                  <div>
                    <p className="text-xs text-gray-300">AI Project Discussion</p>
                    <a 
                      href="tel:+918948890610" 
                      className="text-lg font-bold text-yellow-400 hover:text-yellow-300 transition-colors block"
                    >
                      +91 89488 90610
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-3 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-green-400 animate-bounce" />
                  <div>
                    <p className="text-xs text-gray-300">WhatsApp</p>
                    <a 
                      href="https://wa.me/918948890610" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-green-400 hover:text-green-300 transition-colors block"
                    >
                      +91 89488 90610
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Action Buttons - Enhanced */}
        <div className="border-t border-gray-700 pt-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base px-6 py-3"
            >
              <a href="https://wa.me/918948890610" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Us Now</span>
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base px-6 py-3"
            >
              <a href="tel:+918948890610">
                <Phone className="w-5 h-5" />
                <span>Call Now</span>
              </a>
            </Button>
          </div>
          
          {/* Additional highlight banner */}
          <div className="mt-4 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-4 py-2 rounded-full border border-yellow-400/50">
              <p className="text-sm text-yellow-300">
                <span className="animate-pulse">📞</span> Need AI Development? Call us at 
                <span className="font-bold text-yellow-400 ml-1">+91 89488 90610</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              <p>&copy; 2024 EduMentor AI by Mindexa. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
