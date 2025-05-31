
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, Link } from "react-router-dom";
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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
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
};

const LoginCard = ({
  onSubmit,
  isLoading,
  error,
  loginError,
}: {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  loginError: string | null;
}) => (
  <Card className="w-full max-w-md">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      <CardDescription className="text-center">
        Enter your credentials to access the admin panel
      </CardDescription>
    </CardHeader>
    <CardContent>
      {(loginError || error) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError || error}</AlertDescription>
        </Alert>
      )}
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
    </CardContent>
    <CardFooter className="flex flex-col">
      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/auth" className="text-primary hover:underline">
          Create one
        </Link>
      </p>
    </CardFooter>
  </Card>
);

const Login: React.FC = () => {
  const { signIn, user, session, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (user && session) {
      navigate("/admin");
    }
  }, [user, session, navigate]);

  const onSubmit = async (data: FormData) => {
    setLoginError(null);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setLoginError(error.message);
      } else {
        navigate("/admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError(err instanceof Error ? err.message : "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <LoginCard
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        loginError={loginError}
      />
    </div>
  );
};

export default Login;
