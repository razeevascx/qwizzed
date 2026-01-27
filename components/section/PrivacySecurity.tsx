import { Shield, Lock, Eye, Database, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Layout from "../layout/Layout";

export default function PrivacySecurity() {
  const features = [
    {
      icon: Lock,
      title: "Secure Authentication",
      description:
        "Sign in safely with Google OAuth. Your passwords are never stored in plain text.",
    },

    {
      icon: Database,
      title: "Secure Storage",
      description:
        "All data is stored securely using Supabase with encryption at rest and in transit.",
    },
    {
      icon: CheckCircle,
      title: "Your Rights Protected",
      description:
        "Full control over your data with rights to access, update, delete, and export.",
    },
  ];

  return (
    <Layout className="py-20">
      {" "}
      <div className=" mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Privacy & Security You Can Trust
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-dashed border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className=" mt-12">
        <p className="text-sm text-muted-foreground">
          Read our full{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>{" "}
          for complete details.
        </p>
      </div>
    </Layout>
  );
}
