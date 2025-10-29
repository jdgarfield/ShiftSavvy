import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, FileText, Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      icon: DollarSign,
      title: t('landing.features.tips.title'),
      description: t('landing.features.tips.description'),
    },
    {
      icon: TrendingUp,
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.description'),
    },
    {
      icon: Calculator,
      title: t('landing.features.tax.title'),
      description: t('landing.features.tax.description'),
    },
    {
      icon: FileText,
      title: t('landing.features.export.title'),
      description: t('landing.features.export.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-primary">
            {t('app.name')}
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-16">
        <section className="container max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
              {t('landing.hero')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('landing.subtitle')}
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
              className="h-14 px-8 text-lg font-heading hover-elevate active-elevate-2"
            >
              {t('landing.loginButton')}
            </Button>
          </div>
        </section>

        <section className="container max-w-6xl mx-auto px-4 py-20">
          <h3 className="text-3xl font-heading font-bold text-center mb-12">
            {t('landing.features.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-8 hover-elevate"
                  data-testid={`feature-card-${index}`}
                >
                  <div className="rounded-xl bg-primary/10 p-4 w-fit mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-heading font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
