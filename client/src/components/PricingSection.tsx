import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Check, CreditCard, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { customPlans as fallbackCustomPlans, standardPlans as fallbackStandardPlans } from '@/content/siteContent';
import { getCustomPlans, getStandardPlans } from '@/lib/sanity';

type PricingMode = 'mentoria' | 'custom';

const subgroupOrder = ['8-9 Students', '10-12 Students', 'Graduates', 'Working Professionals'] as const;
const subgroupLabels: Record<(typeof subgroupOrder)[number], string> = {
  '8-9 Students': '8-9 STUDENTS',
  '10-12 Students': '10-12 STUDENTS',
  Graduates: 'COLLEGE GRADUATES',
  'Working Professionals': 'WORKING PROFESSIONALS',
};

function parseRupees(amountLabel: string): number {
  const num = amountLabel.replace(/[^0-9]/g, '');
  return Number.parseInt(num || '0', 10);
}

function money(amountLabel: string): string {
  const value = parseRupees(amountLabel);
  return value.toLocaleString('en-IN');
}

export default function PricingSection() {
  const { data: standardFromCms } = useQuery({
    queryKey: ['sanity', 'standardPlans'],
    queryFn: getStandardPlans,
  });
  const { data: customFromCms } = useQuery({
    queryKey: ['sanity', 'customPlans'],
    queryFn: getCustomPlans,
  });

  const standardPlans = standardFromCms && standardFromCms.length > 0 ? standardFromCms : fallbackStandardPlans;
  const customPlans = customFromCms && customFromCms.length > 0 ? customFromCms : fallbackCustomPlans;

  const groupedStandardPlans = useMemo(() => {
    const groups = standardPlans.reduce<Record<string, Array<(typeof standardPlans)[number]>>>((acc, plan) => {
      if (!acc[plan.subgroup]) {
        acc[plan.subgroup] = [];
      }
      acc[plan.subgroup].push(plan);
      return acc;
    }, {});

    for (const group of Object.values(groups)) {
      group.sort((a, b) => parseRupees(a.amountLabel) - parseRupees(b.amountLabel));
    }

    return groups;
  }, [standardPlans]);

  const availableSubgroups = subgroupOrder.filter((group) => groupedStandardPlans[group]?.length);

  const [mode, setMode] = useState<PricingMode>('mentoria');
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>(availableSubgroups[0] || subgroupOrder[0]);

  const selectedPlans = groupedStandardPlans[selectedSubgroup] || [];
  const basicPlan = selectedPlans[0];
  const premiumPlan = selectedPlans[1];

  const referenceFeatures = useMemo(() => {
    const source = premiumPlan ? [...(premiumPlan.features || []), ...(basicPlan?.features || [])] : basicPlan?.features || [];
    return Array.from(new Set(source));
  }, [basicPlan?.features, premiumPlan]);

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#f3f4f7] border-t-[6px] border-[#0a1775] font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('mentoria')}
            className={`h-12 rounded-md text-sm md:text-base font-semibold font-sans transition-colors ${
              mode === 'mentoria' ? 'bg-[#3f53d1] text-white' : 'bg-white text-[#3f53d1] border border-[#d3d9f7]'
            }`}
          >
            Mentoria&apos;s Plans
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`h-12 rounded-md text-sm md:text-base font-semibold font-sans transition-colors ${
              mode === 'custom' ? 'bg-[#3f53d1] text-white' : 'bg-white text-[#3f53d1] border border-[#d3d9f7]'
            }`}
          >
            Customise Your Mentorship Plan
          </button>
        </div>

        {mode === 'mentoria' ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {availableSubgroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setSelectedSubgroup(group)}
                  className={`min-h-[62px] rounded-md font-semibold font-sans text-xs sm:text-sm uppercase tracking-wide leading-tight px-3 py-2 ${
                    selectedSubgroup === group ? 'bg-[#3f53d1] text-white' : 'bg-white text-[#3f53d1] border border-[#d3d9f7]'
                  }`}
                >
                  <span className="block text-center break-words">{subgroupLabels[group]}</span>
                </button>
              ))}
            </div>

            <div className="relative grid gap-8 lg:grid-cols-2 pt-6">
              <div className="hidden lg:block absolute -left-16 top-36 h-56 w-56 rounded-full bg-[#f0cd00]" />
              <div className="hidden lg:block absolute right-56 top-2 h-20 w-20 rounded-full bg-[#e60063]" />

              {[basicPlan, premiumPlan].filter(Boolean).map((plan, idx) => {
                if (!plan) return null;
                const tier = idx === 0 ? 'STANDARD' : 'PREMIUM';
                const planFeatures = plan.features || [];
                const orderedFeatures = [...referenceFeatures].sort((a, b) => {
                  const aIncluded = planFeatures.includes(a);
                  const bIncluded = planFeatures.includes(b);
                  if (aIncluded === bIncluded) return 0;
                  return aIncluded ? -1 : 1;
                });

                return (
                  <Card key={plan.id} className="relative z-10 rounded-2xl border border-[#e2e7ff] shadow-sm p-6 md:p-8 bg-white font-sans">
                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#6e79e9] mb-2">{tier}</p>
                    <h4 className="text-xl font-semibold text-[#4f5ad2] mb-3">{plan.label}</h4>
                    <p className="text-2xl font-bold text-[#3f53d1] mb-6">
                      <span className="text-sm font-semibold align-top mr-1">Rs.</span>
                      {money(plan.amountLabel)}
                    </p>

                    <ul className="space-y-3 text-sm leading-relaxed text-[#6a6f79] font-sans">
                      {orderedFeatures.map((feature) => {
                        const included = planFeatures.includes(feature);
                        return (
                          <li key={feature} className="flex items-start gap-3">
                            {included ? (
                              <Check className="h-4 w-4 mt-0.5 text-[#3f53d1] shrink-0" />
                            ) : (
                              <X className="h-4 w-4 mt-0.5 text-[#7b84da] shrink-0" />
                            )}
                            <span className={`text-sm font-sans leading-relaxed ${included ? 'text-[#6a6f79]' : 'line-through text-[#8d9199]'}`}>{feature}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <Button className="mt-8 h-10 rounded-full bg-[#3f53d1] hover:bg-[#3446ba] px-8 text-sm font-semibold text-white" asChild>
                      <Link href={`/booking?planId=${encodeURIComponent(plan.id)}`}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        BUY NOW
                      </Link>
                    </Button>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-6 font-sans">
            <div className="rounded-xl border border-[#dce2ff] bg-white p-5">
              <h3 className="text-2xl md:text-3xl font-bold text-[#3f53d1]">Want To Customise Your Mentorship Plan?</h3>
              <p className="text-sm md:text-base text-[#636875] mt-2 leading-relaxed">
                If you want to subscribe to specific services from Mentoria that resolve your career challenges, you can choose one or more custom packages.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {customPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden border border-[#dce2ff] rounded-xl bg-white flex flex-col font-sans">
                  {plan.image ? <img src={plan.image} alt={plan.label} className="h-40 w-full object-cover" loading="lazy" /> : null}
                  <div className="p-5 flex flex-col gap-3 h-full">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#5a67d8] font-semibold">{plan.id}</p>
                    <h4 className="text-xl font-bold text-[#3f53d1]">{plan.label}</h4>
                    <p className="text-lg font-semibold text-[#4f5ad2]">Rs. {money(plan.amountLabel)}</p>
                    <p className="text-sm text-[#636875] leading-relaxed font-sans">{plan.description}</p>
                    <Button className="mt-auto h-10 rounded-full bg-[#3f53d1] hover:bg-[#3446ba] text-sm font-semibold" asChild>
                      <Link href={`/booking?planId=${encodeURIComponent(plan.id)}`}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        BUY NOW
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

