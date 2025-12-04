import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Brain, BarChart3, MessageSquare, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, Video, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  // admin states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Add ref
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Add effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };
  const isAdmin = user?.is_admin === true;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              {/* <Brain className="h-8 w-8 text-primary" /> */}

              <img src="/logo.png" alt="iGenius Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                iGenius
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex md:items-center ${
              isRTL ? "md:space-x-reverse" : ""
            } md:space-x-8`}
          >
            <NavLink
              to="/"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t.nav.home}
            </NavLink>
            <NavLink
              to="/products"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t.nav.product}
            </NavLink>
            <NavLink
              to="/success-stories"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t.nav.customers}
            </NavLink>
            <NavLink
              to="/member-benefits"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t.nav.memberBenefits}
            </NavLink>
            <NavLink
              to="/policies"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t.nav.policies}
            </NavLink>
          </div>

          <div
            className={`hidden md:flex md:items-center ${
              isRTL ? "md:space-x-reverse" : ""
            } md:space-x-4`}
          >
            <LanguageSwitch />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-foreground">
                  👋 {user?.first_name} {user?.last_name}
                  {isAdmin && " (Admin)"} {/* Show admin badge */}
                </span>

                {/* Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="outline"
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1"
                  >
                    <span>Menu</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border z-50">
                      <div className="py-1">
                        {/* Only show Add Video for admin users */}
                        {isAdmin && (
                          <>
                            <NavLink
                              to="/add-video"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                              onClick={closeDropdown}
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add Video</span>
                            </NavLink>

                            <NavLink
                              to="/list-video"
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Video className="h-4 w-4" />
                              <span>List Videos</span>
                            </NavLink>

                            <NavLink
                              to="/manage-comments"
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Manage Comments</span>
                            </NavLink>
                            <NavLink
                              to="/contact-management"
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Manage Contacts</span>
                            </NavLink>

                            <NavLink
                              to="/user-management"
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Users className="h-4 w-4" />
                              <span>Manage Users</span>
                            </NavLink>
                          </>
                        )}
                        {isAuthenticated && !isAdmin && (
                          <NavLink
                            to="/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                            onClick={closeDropdown}
                          >
                            <BarChart3 className="h-4 w-4" />
                            <span>Dashboard</span>
                          </NavLink>
                        )}

                        {/* Add more admin-only links here later */}
                      </div>
                      <div className="border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button variant="hero" asChild>
                <NavLink to="/login">{t.nav.login_button}</NavLink>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div
            className={`md:hidden flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-2`}
          >
            <LanguageSwitch />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            <NavLink
              to="/"
              className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </NavLink>
            <NavLink
              to="/products"
              className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.product}
            </NavLink>
            <NavLink
              to="/success-stories"
              className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.customers}
            </NavLink>
            <NavLink
              to="/member-benefits"
              className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.memberBenefits}
            </NavLink>
            <NavLink
              to="/policies"
              className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.policies}
            </NavLink>

            <div className="px-4 pt-2">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-sm text-foreground px-2 py-1">
                    👋 {user?.first_name} {user?.last_name}
                    {isAdmin && " (Admin)"} {/* Show admin badge */}
                  </div>

                  {/* Add Video Link for Mobile */}
                  {isAdmin && (
                    <>
                      <NavLink
                        to="/add-video"
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Video</span>
                      </NavLink>

                      <NavLink
                        to="/list-video"
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Video className="h-4 w-4" />
                        <span>List Videos</span>
                      </NavLink>

                      <NavLink
                        to="/manage-comments"
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Manage Comments</span>
                      </NavLink>

                      <NavLink
                        to="/contact-management"
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Manage Contacts</span>
                      </NavLink>

                      <NavLink
                        to="/user-management"
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Users className="h-4 w-4" />
                        <span>Manage Users</span>
                      </NavLink>
                    </>
                  )}
                  {isAuthenticated && !isAdmin && (
                    <NavLink
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                      onClick={closeDropdown}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </NavLink>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    {t.nav.logout || "Logout"}
                  </Button>
                </div>
              ) : (
                <Button variant="hero" className="w-full" asChild>
                  <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                    {t.nav.login_button}
                  </NavLink>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
