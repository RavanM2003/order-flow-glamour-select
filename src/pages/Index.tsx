
import { Button } from "@/components/ui/button";
import CheckoutFlow from "@/components/CheckoutFlow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-2xl text-glamour-800">Glamour Studio</div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Services</Button>
            <Button variant="ghost">Contact</Button>
            <Button className="bg-glamour-700 hover:bg-glamour-800">Book Now</Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="max-w-5xl mx-auto">
          <CheckoutFlow />
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © 2024 Glamour Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
