import { Card, CardContent } from "@/components/ui/card";
import { Shield, ShoppingBag, Truck } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Why Choose ModernShop?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the difference with our premium features and exceptional
            service
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShoppingBag,
              title: "Premium Quality",
              description:
                "Carefully curated selection of high-quality products from trusted brands worldwide.",
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-50 dark:bg-blue-900/20",
            },
            {
              icon: Shield,
              title: "Secure Shopping",
              description:
                "Your data is protected with industry-standard security measures and encryption.",
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-50 dark:bg-green-900/20",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              description:
                "Lightning-fast shipping with real-time tracking to get your orders quickly.",
              color: "from-purple-500 to-pink-500",
              bgColor: "bg-purple-50 dark:bg-purple-900/20",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className={`h-full hover:shadow-2xl transition-all duration-500 border-0 ${feature.bgColor} hover:-translate-y-2 group`}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
