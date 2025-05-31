
import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const LoginForm = ({
  form,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  </Form>
);

const RegisterForm = ({
  form,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  </Form>
);

const LoginTabs = ({
  activeTab,
  setActiveTab,
  authError,
  error,
  loginForm,
  registerForm,
  handleLogin,
  handleRegister,
  isLoading,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  authError: string | null;
  error: string | null;
  loginForm: UseFormReturn<LoginFormData>;
  registerForm: UseFormReturn<RegisterFormData>;
  handleLogin: (data: LoginFormData) => Promise<void>;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}) => (
  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
    <TabsList className="grid w-full grid-cols-2 mb-6">
      <TabsTrigger value="login">Login</TabsTrigger>
      <TabsTrigger value="register">Register</TabsTrigger>
    </TabsList>

    {(authError || error) && (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{authError || error}</AlertDescription>
      </Alert>
    )}

    <TabsContent value="login">
      <LoginForm
        form={loginForm}
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
    </TabsContent>

    <TabsContent value="register">
      <RegisterForm
        form={registerForm}
        onSubmit={handleRegister}
        isLoading={isLoading}
      />
    </TabsContent>
  </Tabs>
);

const LoginCard = ({
  activeTab,
  setActiveTab,
  authError,
  error,
  loginForm,
  registerForm,
  handleLogin,
  handleRegister,
  isLoading,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  authError: string | null;
  error: string | null;
  loginForm: UseFormReturn<LoginFormData>;
  registerForm: UseFormReturn<RegisterFormData>;
  handleLogin: (data: LoginFormData) => Promise<void>;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}) => (
  <Card className="w-full max-w-md">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
      <CardDescription className="text-center">
        Sign in or create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <LoginTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authError={authError}
        error={error}
        loginForm={loginForm}
        registerForm={registerForm}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        isLoading={isLoading}
      />
    </CardContent>
    <CardFooter className="text-center">
      <p className="text-sm text-muted-foreground">
        {activeTab === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <Button
          variant="link"
          className="p-0 h-auto ml-1"
          onClick={() =>
            setActiveTab(activeTab === "login" ? "register" : "login")
          }
        >
          {activeTab === "login" ? "Sign up" : "Login"}
        </Button>
      </p>
    </CardFooter>
  </Card>
);

const LoginPage: React.FC = () => {
  const {
    signIn,
    signUp,
    user,
    session,
    isLoading,
    error,
  } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    if (user && session) {
      navigate("/admin");
    }
  }, [user, session, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setAuthError(error.message);
      } else {
        navigate("/admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(err instanceof Error ? err.message : "Failed to login");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      const { error } = await signUp(data.email, data.password, {
        first_name: data.first_name,
        last_name: data.last_name,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        navigate("/admin");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError(err instanceof Error ? err.message : "Failed to register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <LoginCard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authError={authError}
        error={error}
        loginForm={loginForm}
        registerForm={registerForm}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        isLoading={isLoading}
      />
    </div>
  );
};

export default LoginPage;
