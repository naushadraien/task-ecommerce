import { Award, Clock, Truck, Users } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: Users, number: "10K+", label: "Happy Customers" },
            { icon: Award, number: "500+", label: "Products" },
            { icon: Clock, number: "24/7", label: "Support" },
            { icon: Truck, number: "99%", label: "On-Time Delivery" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">
                {stat.number}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
