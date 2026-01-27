import React from "react";
import Layout from "@/components/layout/Layout";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQS: FAQItem[] = [
  {
    question: "What is Qwizzed?",
    answer: (
      <>
        Qwizzed is a platform for creating, sharing, and taking interactive
        quizzes. It helps educators, teams, and communities engage with
        knowledge in a fun way.
      </>
    ),
  },
  {
    question: "How do I create a quiz?",
    answer: (
      <>
        Sign in, go to the dashboard, and click on &quot;Create Quiz&quot;. Fill
        in the details and add your questions. You can share your quiz with
        others once it&apos;s published.
      </>
    ),
  },
  {
    question: "Is Qwizzed free to use?",
    answer: (
      <>
        Yes, Qwizzed offers free access to core features. Advanced features may
        require a subscription in the future.
      </>
    ),
  },
  {
    question: "How is my data protected?",
    answer: (
      <>
        We use Supabase for secure authentication and data storage. Please see
        our{" "}
        <a
          href="/privacy"
          className="underline text-primary hover:text-accent transition-colors font-medium"
        >
          Privacy Policy
        </a>{" "}
        for details.
      </>
    ),
  },
];

export default function FAQSection({ faqs = FAQS }: { faqs?: FAQItem[] }) {
  return (
    <Layout className="mb-16">
      <div className=" mb-16">
        <p className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Frequently Asked Questions
        </p>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Everything you need to know about Qwizzed. Can&apos;t find the answer
          you&apos;re looking for? Feel free to reach out to our support team.
        </p>
      </div>

      <div className=" divide-y divide-border/50 ">
        {faqs.map((faq, idx) => (
          <details key={idx} className="group py-6 first:pt-0 last:pb-0">
            <summary className="flex w-full items-start justify-between text-left cursor-pointer list-none select-none">
              <span className="text-lg font-semibold leading-7 text-foreground group-hover:text-primary transition-colors duration-200">
                {faq.question}
              </span>
              <span className="ml-6 flex h-7 items-center">
                <ChevronDown className="h-5 w-5 text-muted-foreground group-open:-rotate-180 transition-transform duration-300 ease-in-out" />
              </span>
            </summary>
            <div className="mt-4 pr-12 overflow-hidden transition-all duration-300">
              <p className="text-base leading-7 text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </Layout>
  );
}
