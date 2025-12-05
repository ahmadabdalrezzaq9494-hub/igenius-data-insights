import { useState, useEffect, useRef } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, BarChart3, MessageSquare, Users, ChevronDown, Video, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Rakan Logo" className="h-10 w-10" />
              <span className="text-2xl font-serif font-bold text-foreground tracking-wide">
                Rakan
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex md:items-center ${isRTL ? "md:space-x-reverse" : ""} md:space-x-8`}>
            <NavLink
              to="/"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              {t.nav.home}
            </NavLink>
            <NavLink
              to="/about"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              {t.nav.about}
            </NavLink>
            <NavLink
              to="/services"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              {t.nav.services}
            </NavLink>
            <NavLink
              to="/contact"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              {t.nav.contact}
            </NavLink>
          </div>

          {/* Desktop Actions */}
          <div className={`hidden md:flex md:items-center ${isRTL ? "md:space-x-reverse" : ""} md:space-x-4`}>
            <LanguageSwitch />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-foreground/80">
                  {user?.first_name} {user?.last_name}
                  {isAdmin && " (Admin)"}
                </span>

                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="outline"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 border-primary/30 hover:border-primary"
                  >
                    <span>Menu</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </Button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-elegant bg-background border border-border z-50">
                      <div className="py-1">
                        {isAdmin && (
                          <>
                            <NavLink
                              to="/add-video"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add Video</span>
                            </NavLink>
                            <NavLink
                              to="/list-video"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Video className="h-4 w-4" />
                              <span>List Videos</span>
                            </NavLink>
                            <NavLink
                              to="/manage-comments"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Manage Comments</span>
                            </NavLink>
                            <NavLink
                              to="/contact-management"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Manage Contacts</span>
                            </NavLink>
                            <NavLink
                              to="/user-management"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Users className="h-4 w-4" />
                              <span>Manage Users</span>
                            </NavLink>
                          </>
                        )}
                        {!isAdmin && (
                          <NavLink
                            to="/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <BarChart3 className="h-4 w-4" />
                            <span>Dashboard</span>
                          </NavLink>
                        )}
                      </div>
                      <div className="border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          {t.nav.logout}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <NavLink to="/login">{t.nav.login_button}</NavLink>
                </Button>
                <Button variant="default" asChild className="bg-primary hover:bg-primary/90">
                  <NavLink to="/contact">{t.nav.consultation}</NavLink>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className={`md:hidden flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-2`}>
            <LanguageSwitch />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in border-t border-border/50">
            <NavLink
              to="/"
              className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </NavLink>
            <NavLink
              to="/about"
              className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.about}
            </NavLink>
            <NavLink
              to="/services"
              className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.services}
            </NavLink>
            <NavLink
              to="/contact"
              className="block w-full text-left px-4 py-3 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.contact}
            </NavLink>

            <div className="px-4 pt-4 border-t border-border/50">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-sm text-foreground/80 px-2 py-1">
                    {user?.first_name} {user?.last_name}
                    {isAdmin && " (Admin)"}
                  </div>

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
                  {!isAdmin && (
                    <NavLink
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </NavLink>
                  )}

                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    {t.nav.logout}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav.login_button}
                    </NavLink>
                  </Button>
                  <Button variant="default" className="w-full" asChild>
                    <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav.consultation}
                    </NavLink>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
