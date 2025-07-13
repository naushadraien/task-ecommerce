import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccessPage() {
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Order Number</h3>
                <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly with your order
              details and tracking information.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/products" className="block">
              <Button className="w-full">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center pt-8">
            <h3 className="font-semibold mb-2">What&apos;s Next?</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📧 Check your email for order confirmation</p>
              <p>📦 Your order will be processed within 1-2 business days</p>
              <p>🚚 Estimated delivery: 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
