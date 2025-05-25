import { useSettings } from "@/hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";

const FooterSection = ({ title, children }) => (
  <div>
    <h3 className="font-bold text-glamour-800 mb-4">{title}</h3>
    {children}
  </div>
);

const SkeletonContent = () => (
  <div className="container">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const FooterSkeleton = () => (
  <footer className="border-t py-12 bg-glamour-50">
    <SkeletonContent />
  </footer>
);

const FooterGrid = ({
  siteName,
  aboutUs,
  address,
  contactEmail,
  contactPhone,
  workingHours,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <FooterSection title={siteName}>
      <p className="text-gray-600">{aboutUs}</p>
    </FooterSection>

    <FooterSection title="Contact Us">
      <address className="text-gray-600 not-italic">
        <div dangerouslySetInnerHTML={{ __html: address }} />
        <p className="mt-2">Email: {contactEmail}</p>
        <p>Phone: {contactPhone}</p>
      </address>
    </FooterSection>

    <FooterSection title="Hours">
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{ __html: workingHours }}
      />
    </FooterSection>
  </div>
);

const FooterContent = ({
  siteName,
  aboutUs,
  address,
  contactEmail,
  contactPhone,
  workingHours,
}) => (
  <div className="container">
    <FooterGrid
      siteName={siteName}
      aboutUs={aboutUs}
      address={address}
      contactEmail={contactEmail}
      contactPhone={contactPhone}
      workingHours={workingHours}
    />
    <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
      <p>© 2024 {siteName}. All rights reserved.</p>
    </div>
  </div>
);

const Footer = () => {
  const { getLocalizedSetting, isLoading } = useSettings();

  if (isLoading) {
    return <FooterSkeleton />;
  }

  const siteName = getLocalizedSetting("site_name");
  const aboutUs = getLocalizedSetting("about_us");
  const contactPhone = getLocalizedSetting("contact_phone");
  const contactEmail = getLocalizedSetting("contact_email");
  const address = getLocalizedSetting("address");
  const workingHours = getLocalizedSetting("working_hours");

  return (
    <footer className="border-t py-12 bg-glamour-50">
      <FooterContent
        siteName={siteName}
        aboutUs={aboutUs}
        address={address}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        workingHours={workingHours}
      />
    </footer>
  );
};

export default Footer;
