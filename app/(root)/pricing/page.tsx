import { auth } from "@/auth";
import { checkProMembership } from "@/lib/actions/stripe.action";
import { redirect } from "next/navigation";
import PricingCard from "@/components/pricing/PricingCard";
import { Check, X } from "lucide-react";

const PricingPage = async ({ searchParams }: RouteParams) => {
  const session = await auth();
  const { canceled } = await searchParams;

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { data: membershipData } = await checkProMembership();
  const isPro = membershipData?.isPro || false;

  const features = [
    {
      name: "Access to Job Board",
      included: true,
    },
    {
      name: "Advanced Job Filters",
      included: true,
    },
    {
      name: "Priority Support",
      included: true,
    },
    {
      name: "Unlimited Job Applications",
      included: true,
    },
    {
      name: "Job Alerts",
      included: true,
    },
    {
      name: "Resume Builder",
      included: false,
    },
    {
      name: "Interview Preparation",
      included: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock Your Career Potential
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get access to our premium job board with advanced filters, priority support, and unlimited applications.
          </p>
          {canceled && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
              Payment was canceled. You can try again anytime.
            </div>
          )}
        </div>

        {isPro ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                You're a Pro Member!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You have full access to all premium features.
              </p>
              <a
                href="/jobs"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Access Job Board
              </a>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              plan="monthly"
              price={9.99}
              period="month"
              features={features}
              popular={false}
            />
            <PricingCard
              plan="yearly"
              price={99.99}
              period="year"
              features={features}
              popular={true}
              savings={20}
            />
          </div>
        )}

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            What's Included
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All plans include a 30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
