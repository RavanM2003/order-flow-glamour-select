import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context";
import { useSettings } from "@/hooks/use-settings";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

const ContactForm = ({
  onSubmit,
  isSubmitting,
  t,
  getLocalizedSetting,
}: {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
  t: (key: string) => string;
  getLocalizedSetting: (key: string, defaultValue?: string) => string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const handleFormSubmit = async (data: ContactFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-glamour-800 mb-6">
        {getLocalizedSetting("contact_form_title")}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("contact.name")} *
          </label>
          <Input
            id="name"
            placeholder={t("contact.namePlaceholder")}
            {...register("name", {
              required: t("contact.nameRequired"),
            })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("contact.email")} *
          </label>
          <Input
            id="email"
            type="email"
            placeholder={t("contact.emailPlaceholder")}
            {...register("email", {
              required: t("contact.emailRequired"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("contact.emailInvalid"),
              },
            })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("contact.phone")}
          </label>
          <Input
            id="phone"
            placeholder={t("contact.phonePlaceholder")}
            {...register("phone")}
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("contact.subject")}
          </label>
          <Input
            id="subject"
            placeholder={t("contact.subjectPlaceholder")}
            {...register("subject")}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("contact.message")} *
          </label>
          <Textarea
            id="message"
            placeholder={t("contact.messagePlaceholder")}
            rows={5}
            {...register("message", {
              required: t("contact.messageRequired"),
            })}
            className={errors.message ? "border-red-500" : ""}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-glamour-700 hover:bg-glamour-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("contact.sending") : t("contact.send")}
        </Button>
      </form>
    </div>
  );
};

const ContactInfoItem = ({
  icon: Icon,
  title,
  content,
}: {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}) => (
  <div className="flex items-start">
    <Icon className="h-6 w-6 text-glamour-700 mr-3 mt-1" />
    <div>
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      <div className="text-gray-600">{content}</div>
    </div>
  </div>
);

const ContactInfo = ({
  t,
  getLocalizedSetting,
}: {
  t: (key: string) => string;
  getLocalizedSetting: (key: string, defaultValue?: string) => string;
}) => {
  const contactPhone = getLocalizedSetting("contact_phone");
  const contactEmail = getLocalizedSetting("contact_email");
  const address = getLocalizedSetting("address");
  const workingHours = getLocalizedSetting("working_hours");

  return (
    <div>
      <h2 className="text-2xl font-semibold text-glamour-800 mb-6">
        {getLocalizedSetting("contact_info_title")}
      </h2>

      <div className="space-y-6">
        <ContactInfoItem
          icon={MapPin}
          title={t("contact.address")}
          content={<div dangerouslySetInnerHTML={{ __html: address }} />}
        />
        <ContactInfoItem
          icon={Phone}
          title={t("contact.phoneNumber")}
          content={contactPhone}
        />
        <ContactInfoItem
          icon={Mail}
          title={t("contact.emailAddress")}
          content={contactEmail}
        />
        <ContactInfoItem
          icon={Clock}
          title={t("contact.workingHours")}
          content={<div dangerouslySetInnerHTML={{ __html: workingHours }} />}
        />
      </div>

      <div className="mt-8 bg-gray-100 h-64 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Google Maps integration will be here</p>
      </div>
    </div>
  );
};

const ContactContent = ({
  contactTitle,
  contactSubtitle,
  onSubmit,
  isSubmitting,
  t,
  getLocalizedSetting,
}: {
  contactTitle: string;
  contactSubtitle: string;
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
  t: (key: string) => string;
  getLocalizedSetting: (key: string, defaultValue?: string) => string;
}) => (
  <main className="py-12">
    <div className="container">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-4">
          {contactTitle}
        </h1>
        <p className="text-lg text-gray-600">{contactSubtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <ContactForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          t={t}
          getLocalizedSetting={getLocalizedSetting}
        />
        <ContactInfo t={t} getLocalizedSetting={getLocalizedSetting} />
      </div>
    </div>
  </main>
);

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { getLocalizedSetting } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactTitle = getLocalizedSetting("contact_title");
  const contactSubtitle = getLocalizedSetting("contact_subtitle");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject || "Website Contact Form",
          message: data.message,
        },
      ]);

      if (error) throw error;

      toast({
        title: t("contact.messageSentTitle"),
        description: t("contact.messageSentDesc"),
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        variant: "destructive",
        title: t("contact.errorTitle"),
        description: t("contact.errorDesc"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ContactContent
        contactTitle={contactTitle}
        contactSubtitle={contactSubtitle}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        t={t}
        getLocalizedSetting={getLocalizedSetting}
      />
      <Footer />
    </div>
  );
};

export default Contact;
