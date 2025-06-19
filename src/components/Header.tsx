
import { Book, Menu, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { savedTopics, history } = useAppContext();

  const navigationItems = [
    { id: "progress", label: "My Progress", count: history.length },
    { id: "saved", label: "Saved Topics", count: savedTopics.length },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <Book className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                EduMentor AI
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Your AI Study Companion
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Button 
                key={item.id}
                variant="ghost" 
                className="text-sm relative hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {item.label}
                {item.count > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Button>
            ))}
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
              Get Started
            </Button>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            {navigationItems.map((item) => (
              <Button 
                key={item.id}
                variant="ghost" 
                size="sm"
                className="text-xs relative"
              >
                {item.label}
                {item.count > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {item.count}
                  </span>
                )}
              </Button>
            ))}
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              Start
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="text-center pb-4 border-b">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                        <Book className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">EduMentor AI</span>
                    </div>
                    <p className="text-sm text-gray-600">Your AI Study Companion</p>
                  </div>
                  
                  {navigationItems.map((item) => (
                    <Button 
                      key={item.id}
                      variant="ghost" 
                      className="justify-between h-12 text-left"
                      onClick={closeSheet}
                    >
                      <span>{item.label}</span>
                      {item.count > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[24px] h-6 flex items-center justify-center">
                          {item.count}
                        </span>
                      )}
                    </Button>
                  ))}
                  
                  <div className="pt-4 border-t space-y-3">
                    <Button 
                      variant="ghost" 
                      className="justify-start h-12 w-full"
                      onClick={closeSheet}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start h-12 w-full"
                      onClick={closeSheet}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                  
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white justify-center h-12 mt-6"
                    onClick={closeSheet}
                  >
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
