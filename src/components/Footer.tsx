
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

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-300">AI Project Discussion</p>
                  <a href="tel:+918948890610" className="text-sm font-medium hover:text-blue-400 transition-colors">
                    +91 89488 90610
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-300">WhatsApp</p>
                  <a 
                    href="https://wa.me/918948890610" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-blue-400 transition-colors"
                  >
                    +91 89488 90610
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div className="border-t border-gray-700 pt-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            >
              <a href="https://wa.me/918948890610" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center space-x-2"
            >
              <a href="tel:+918948890610">
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </Button>
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
