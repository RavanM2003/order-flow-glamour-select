import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Scissors,
  Info,
  Phone,
  Package,
  Calendar,
  LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context";
import { useSettings } from "@/hooks/use-settings";
import LanguageSelector from "./LanguageSelector";

const NavItem = memo(
  ({
    to,
    icon: Icon,
    label,
    isActive,
  }: {
    to: string;
    icon: LucideIcon;
    label?: string;
    isActive: boolean;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={isActive ? "bg-glamour-700" : ""}
      asChild
    >
      <Link to={to} className="flex items-center">
        <Icon className="h-4 w-4 mr-2" />
        {label && <span>{label}</span>}
      </Link>
    </Button>
  )
);

const MobileNavItem = memo(
  ({
    to,
    icon: Icon,
    isActive,
  }: {
    to: string;
    icon: LucideIcon;
    isActive: boolean;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={isActive ? "bg-glamour-700" : ""}
      asChild
    >
      <Link to={to} className="flex flex-col items-center p-2">
        <Icon className="h-5 w-5" />
      </Link>
    </Button>
  )
);

const MobileNavBar = memo(
  ({ isActive }: { isActive: (path: string) => boolean }) => (
    <div className="border-b px-2 py-2 bg-white sticky top-[60px] z-40">
      <div className="flex items-center justify-around">
        <MobileNavItem to="/" icon={Home} isActive={isActive("/")} />
        <MobileNavItem
          to="/services"
          icon={Scissors}
          isActive={isActive("/services")}
        />
        <MobileNavItem
          to="/products"
          icon={Package}
          isActive={isActive("/products")}
        />
        <MobileNavItem to="/about" icon={Info} isActive={isActive("/about")} />
        <MobileNavItem
          to="/contact"
          icon={Phone}
          isActive={isActive("/contact")}
        />
      </div>
    </div>
  )
);

const MobileBookingBar = memo(
  ({
    t,
    handleBookingClick,
  }: {
    t: (key: string) => string;
    handleBookingClick: () => void;
  }) => (
    <div className="px-4 py-3 bg-white sticky top-[120px] z-30">
      <div className="flex items-center justify-between">
        <LanguageSelector />
        <Button
          className="bg-glamour-700 hover:bg-glamour-800 flex-1 ml-4"
          onClick={handleBookingClick}
        >
          <Calendar className="h-4 w-4 mr-2" />
          <span>{t("nav.bookNow")}</span>
        </Button>
      </div>
    </div>
  )
);

const BookNowButton = memo(
  ({
    t,
    handleBookingClick,
  }: {
    t: (key: string) => string;
    handleBookingClick: () => void;
  }) => (
    <Button
      className="bg-glamour-700 hover:bg-glamour-800"
      onClick={handleBookingClick}
    >
      <Calendar className="h-4 w-4 mr-2" />
      <span>{t("nav.bookNow")}</span>
    </Button>
  )
);

const DesktopNavItems = memo(
  ({
    t,
    isActive,
  }: {
    t: (key: string) => string;
    isActive: (path: string) => boolean;
  }) => (
    <div className="flex items-center space-x-4">
      <NavItem
        to="/"
        icon={Home}
        label={t("nav.home")}
        isActive={isActive("/")}
      />
      <NavItem
        to="/services"
        icon={Scissors}
        label={t("nav.services")}
        isActive={isActive("/services")}
      />
      <NavItem
        to="/products"
        icon={Package}
        label={t("nav.products")}
        isActive={isActive("/products")}
      />
      <NavItem
        to="/about"
        icon={Info}
        label={t("nav.about")}
        isActive={isActive("/about")}
      />
      <NavItem
        to="/contact"
        icon={Phone}
        label={t("nav.contact")}
        isActive={isActive("/contact")}
      />
    </div>
  )
);

const DesktopHeader = memo(
  ({
    siteName,
    t,
    isActive,
    handleBookingClick,
  }: {
    siteName: string;
    t: (key: string) => string;
    isActive: (path: string) => boolean;
    handleBookingClick: () => void;
  }) => (
    <div className="hidden md:block">
      <div className="container flex h-16 items-center justify-between">
        <div className="font-bold text-2xl text-glamour-800">{siteName}</div>
        <div className="flex items-center space-x-4">
          <DesktopNavItems t={t} isActive={isActive} />
          <LanguageSelector />
          <BookNowButton t={t} handleBookingClick={handleBookingClick} />
        </div>
      </div>
    </div>
  )
);

const MobileHeader = memo(
  ({
    siteName,
    t,
    isActive,
    handleBookingClick,
  }: {
    siteName: string;
    t: (key: string) => string;
    isActive: (path: string) => boolean;
    handleBookingClick: () => void;
  }) => (
    <div className="md:hidden">
      <div className="border-b px-4 py-3 bg-white sticky top-0 z-50">
        <div className="text-center">
          <h1 className="font-bold text-xl text-glamour-800">{siteName}</h1>
        </div>
      </div>
      <MobileNavBar isActive={isActive} />
      <MobileBookingBar t={t} handleBookingClick={handleBookingClick} />
    </div>
  )
);

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getLocalizedSetting } = useSettings();

  const isActive = (path: string) => location.pathname === path;
  const handleBookingClick = () => navigate("/booking");
  const siteName = getLocalizedSetting("site_name") || "Glamour Studio";

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
      <DesktopHeader
        siteName={siteName}
        t={t}
        isActive={isActive}
        handleBookingClick={handleBookingClick}
      />
      <MobileHeader
        siteName={siteName}
        t={t}
        isActive={isActive}
        handleBookingClick={handleBookingClick}
      />
    </header>
  );
};

export default memo(Header);
