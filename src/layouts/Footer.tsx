import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ModernShop</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for quality products at unbeatable prices.
              Shop with confidence and enjoy fast, secure delivery.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Shopping Cart
              </Link>
              <Link
                href="/login"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Help Center
              </Link>
              <Link
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Shipping Info
              </Link>
              <Link
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@modernshop.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 ModernShop. All rights reserved. Built with Next.js and
            Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
