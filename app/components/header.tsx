import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/services", label: "Services" },
  { to: "/logs", label: "Logs" },
  { to: "/metrics", label: "Metrics" },
  { to: "/ci-cd", label: "CI/CD" },
  { to: "/docs", label: "Docs" },
] as const;

export function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/auth?mode=signin";
        },
      },
    });
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[var(--color-studojo-ink)] shadow-[var(--shadow-brutal)]">
      <nav className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)]">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)]">
              Dev Panel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg font-['Satoshi'] font-medium text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--color-studojo-purple-bg)] text-[var(--color-studojo-purple)]"
                      : "text-[var(--color-studojo-muted)] hover:text-[var(--color-studojo-ink)] hover:bg-[var(--color-studojo-surface-muted)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-studojo-surface-muted)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--color-studojo-purple)] flex items-center justify-center text-white font-['Satoshi'] font-medium text-sm">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block font-['Satoshi'] text-sm text-[var(--color-studojo-ink)]">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-['Satoshi'] font-medium text-[var(--color-studojo-ink)]">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs font-['Satoshi'] text-[var(--color-studojo-muted)]">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm font-['Satoshi'] text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth?mode=signin"
                className="px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium text-sm hover:bg-[var(--color-studojo-violet-500)] transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-studojo-surface-muted)] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 rounded-lg font-['Satoshi'] font-medium text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--color-studojo-purple-bg)] text-[var(--color-studojo-purple)]"
                        : "text-[var(--color-studojo-muted)] hover:text-[var(--color-studojo-ink)] hover:bg-[var(--color-studojo-surface-muted)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

