import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Gift, Heart, UserPlus, Zap } from "lucide-react";
import Link from "next/link";

type Props = {
  isAuthenticated: boolean;
  onClickRegister?: VoidFunction;
  onClickSignIn?: VoidFunction;
};

export default function CTASection({
  isAuthenticated,
  onClickRegister,
  onClickSignIn,
}: Props) {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8" />
              <Heart className="h-8 w-8" />
              <Gift className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isAuthenticated ? "Ready to Start Shopping?" : "Ready to Join Us?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isAuthenticated
              ? "Explore our full catalog and discover amazing deals every day"
              : "Join thousands of satisfied customers and unlock exclusive access to premium products"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={onClickRegister}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Free Account
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-2xl bg-transparent border-2 transition-all duration-300"
                  onClick={onClickSignIn}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </>
            ) : (
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Browse Products
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
