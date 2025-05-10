
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This component fixes the scroll behavior when navigating between pages
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
