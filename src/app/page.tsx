import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/site-footer';
import { MorePanel } from '@/components/layout/more-panel';
import { SiteHeader } from '@/components/layout/site-header';
import { CommunityBenefits } from '@/features/home/sections/community-benefits';
import { Events } from '@/features/home/sections/events';
import { Hero } from '@/features/home/sections/hero';
import { ImpactStories } from '@/features/home/sections/impact-stories';
import { MembershipBenefits } from '@/features/home/sections/membership-benefits';
import { NewsletterSection } from '@/features/home/sections/newsletter-section';
import { Sponsorship } from '@/features/home/sections/sponsorship';
import { TrustedCompanies } from '@/features/home/sections/trusted-companies';
import { MotionRoot } from '@/lib/motion/motion-root';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getHomePage, getSiteSettings } from '@/services/content';

/** Fully static: content is read at build time. Revisit (ISR / tag revalidation) with Sanity. */
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage();
  return buildPageMetadata(seo);
}

export default async function HomePage() {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomePage()]);

  return (
    <MotionRoot className="page-wrapper">
      {/* `.main-wrapper` only clips overflow; landmarks sit inside it: banner, main, contentinfo. */}
      <div className="main-wrapper">
        <SiteHeader
          navigation={settings.navigation}
          brandName={settings.brand.name}
          morePanel={<MorePanel more={settings.navigation.more} newsletter={settings.newsletter} />}
        />
        <main id="main-content" tabIndex={-1}>
          <Hero content={home.hero} />
          <TrustedCompanies content={home.trustedCompanies} />
          <Events content={home.events} />
          <CommunityBenefits content={home.communityBenefits} />
          <ImpactStories content={home.impactStories} />
          <MembershipBenefits content={home.membershipBenefits} />
          <NewsletterSection content={home.newsletter} copy={settings.newsletter} />
          <Sponsorship content={home.sponsorship} />
        </main>
        <SiteFooter settings={settings} />
      </div>
    </MotionRoot>
  );
}
