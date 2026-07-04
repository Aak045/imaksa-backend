// seed-blogs.js — Insert 5 blog articles directly into MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const ARTICLES = [
  {
    title: 'UAE Golden Visa: The Complete 2026 Guide',
    cat: 'Golden Visa',
    status: 'Published',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    readTime: '7 min read',
    desc: 'The UAE Golden Visa remains one of the most compelling residency programs in the world for real estate investors, and 2026 has brought meaningful updates that make it more accessible than before.',
    content: `The UAE Golden Visa remains one of the most compelling residency programs in the world for real estate investors, and 2026 has brought meaningful updates that make it more accessible than before.

For real estate investors, the core requirement is property ownership with a total certified value of at least AED 2,000,000 — as confirmed by a letter from the relevant land department. The significant change introduced in February 2026 is that the previous requirement to have paid at least 50% of the property value upfront has been removed. The qualifying criterion is now the total property value as certified by the DLD, regardless of your outstanding mortgage balance. Mortgaged properties from approved UAE banks qualify, and off-plan properties from approved developers are also accepted. Multiple properties can be combined to reach the AED 2 million threshold.

For investors aged 55 and over, a lower threshold applies: a property value of AED 1 million qualifies for a 5-year Golden Visa. Younger investors aged 18 and above need the AED 2 million threshold for the 10-year visa. A 2-year property investor visa is also available for sole owners of completed properties with no minimum value requirement as of April 2026.

The Golden Visa grants 10-year renewable residency with no need for a local sponsor, the right to live, work, and study in the UAE, family inclusion for spouses and children, and the ability to remain outside the UAE for extended periods without losing your residency status. Application fees are approximately AED 10,400, and the process typically takes around 3 months from submission. Dubai has issued over 100,000 real estate investor family visas between 2021 and early 2026, making property investment the most active Golden Visa pathway in the emirate.`,
  },
  {
    title: 'Off-Plan vs Ready Property: Which is Better?',
    cat: 'Investment',
    status: 'Published',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    readTime: '6 min read',
    desc: 'Choosing between off-plan and ready property is one of the most consequential decisions a Dubai buyer faces in 2026, and the right answer depends heavily on your goals, timeline, and risk tolerance.',
    content: `Choosing between off-plan and ready property is one of the most consequential decisions a Dubai buyer faces in 2026, and the right answer depends heavily on your goals, timeline, and risk tolerance.

Off-plan property — units purchased before or during construction — dominated Dubai's market in 2025 and continues to attract strong demand in 2026. Off-plan buyers typically purchase at 10–20% below the eventual market value at launch, with flexible payment plans commonly structured as 40% during construction and 60% on handover. The Dubai Land Department's RERA escrow regulations protect buyers: all developer funds are held in escrow and released only in line with verified construction milestones. Q1 2026 data shows off-plan transactions recording a 128% year-on-year increase in values.

Ready property — completed units available for immediate occupation or rental — offers a different value proposition. You can inspect the actual unit before buying, rental income begins immediately, and there is no construction timeline risk. In areas like Business Bay, JVC, and Dubai Marina, ready properties are transacting at AED 1,759 per square foot on average as of Q1 2026 — a 14% year-on-year increase. Rental yields on ready units in mid-market communities range from 6–9% gross, with JVC leading at 8.5–9.5%.

The key risk with off-plan is delivery: approximately 72% of units scheduled for completion are currently running behind projected timelines. The key risk with ready property is entry price — in a rising market, you pay today's elevated price without the launch discount off-plan buyers enjoy. For investors with a 3–5 year horizon and patience for construction timelines, off-plan has historically delivered strong returns. For buyers needing rental income now, ready property is the more predictable path.`,
  },
  {
    title: 'Top 5 Dubai Areas for Highest Rental Yields in 2026',
    cat: 'Investment',
    status: 'Published',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    readTime: '5 min read',
    desc: "Dubai's rental market in 2026 remains one of the most attractive globally, with average gross yields of 6–9% significantly outperforming London, Singapore, and New York.",
    content: `Dubai's rental market in 2026 remains one of the most attractive globally, with average gross yields of 6–9% significantly outperforming London (3–4%), Singapore (2–3%), and New York (4–5%). Here are the five areas consistently delivering the strongest returns for investors this year.

Jumeirah Village Circle (JVC) leads Dubai's yield table with gross returns of 8.5–9.5% depending on unit type and building. A studio purchased at around AED 450,000 generating AED 38,000 in annual rent works out to approximately 8.4% gross. JVC's population is tracking toward 300,000 residents, sustaining strong tenant demand despite growing new supply.

Dubai Silicon Oasis delivers net yields of around 6.1% for 1-bedroom apartments, with improving infrastructure and the planned Dubai Metro Blue Line expansion expected to enhance accessibility. Dubai Sports City offers strong yields of 6.6–6.8% across studios and 1-bedrooms, with consistent professional and budget-conscious tenant demand. Arjan provides solid gross yields in the 8–9% range with lower entry prices. Business Bay, while yielding 5.5–7.6% gross, offers the strongest combination of yield, liquidity, and capital appreciation — its proximity to Downtown Dubai and strong corporate tenant pool make it a favorite for balanced investors.

When comparing areas, always focus on net yield rather than gross. After service charges (AED 10–32 per square foot annually) and a realistic vacancy allowance, a 9% gross yield in a mid-market community typically settles at 5.5–6.5% net. IMAKSA specialises in yield-focused property selection across all of these communities.`,
  },
  {
    title: 'Dubai Real Estate Market 2026: What Investors Need to Know',
    cat: 'Market Update',
    status: 'Published',
    img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    readTime: '8 min read',
    desc: "Dubai's real estate market entered 2026 from a position of exceptional strength, and Q1 2026 data confirms that momentum has continued rather than moderated.",
    content: `Dubai's real estate market entered 2026 from a position of exceptional strength, and Q1 2026 data confirms that momentum has continued rather than moderated.

January 2026 recorded AED 72.4 billion in real estate sales — the highest single month in Dubai's history, representing a 63% year-on-year increase. Q1 2026 as a whole saw over 44,000 transactions worth AED 252 billion, a 31% year-on-year increase in value. The average price per square foot reached AED 1,759 in Q1 2026, a 14% jump year-on-year. Three forces are driving this: continued population growth (Dubai exceeded 4 million residents in 2025, growing at 6.1% annually), Golden Visa uptake creating a committed base of long-term resident buyers, and actual property handovers consistently running 30–40% below projected schedules, meaning supply is reaching the market more slowly than the pipeline suggests.

Dubai's investment case rests on structural advantages: zero property tax, zero capital gains tax, zero income tax on rental earnings, full freehold ownership rights for all nationalities in designated zones, and average gross rental yields of 6–9% that compare favourably with every major global city. The market is working toward the Dubai Real Estate Sector Strategy 2033, targeting a 70% increase in transaction volume to reach AED 1 trillion annually.

For investors considering entry in 2026, the honest picture is this: the exceptional price gains of 2022–2025 are unlikely to repeat exactly, and the large off-plan pipeline creates genuine future supply to absorb. However, population growth, infrastructure investment, and sustained international capital flows continue to support the market's fundamentals.`,
  },
  {
    title: 'How to Buy Property in Dubai as a Foreigner in 2026',
    cat: 'Buying Guide',
    status: 'Published',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    readTime: '6 min read',
    desc: 'Dubai is one of the few major global cities where foreign nationals can purchase freehold property with full ownership rights, no local sponsor, no UAE residency required, and no restrictions on nationality.',
    content: `Dubai is one of the few major global cities where foreign nationals can purchase freehold property with full ownership rights, no local sponsor, no UAE residency required, and no restrictions on nationality. Here is a clear walkthrough of the process as it stands in 2026.

Foreigners can buy in over 60 designated freehold zones, including Dubai Marina, Downtown Dubai, Palm Jumeirah, Business Bay, JVC, Dubai Hills Estate, Dubai Creek Harbour, Arabian Ranches, and Emirates Hills. You receive a DLD-registered title deed with the right to sell, lease, mortgage, or pass the property to heirs. A valid passport is the only identification required to begin a transaction.

The buying process follows six clear steps. First, identify your property within a designated freehold zone and agree on a price. Second, sign a Memorandum of Understanding (MOU) and pay a deposit — typically 10% of the purchase price. Third, the seller obtains a No Objection Certificate (NOC) from the developer. Fourth, pay the DLD transfer fee of 4% of the purchase price. Fifth, receive your title deed, registered in your name with the Dubai Land Department. For off-plan purchases, the Oqood system handles initial registration. The full process for a ready property typically takes two to six weeks from MOU signing to title deed.

Total transaction costs run approximately 6–8% of the purchase price, covering the 4% DLD fee, agent commission (typically 2%), trustee office fee, and title deed issuance. Mortgages are available to non-residents at up to 50% loan-to-value. A property purchase of AED 2 million or more qualifies for the 10-year UAE Golden Visa. Dubai has zero property tax, zero capital gains tax, and zero income tax on rental income — making it one of the most tax-efficient ownership environments globally.`,
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB.\n');

  for (let i = 0; i < ARTICLES.length; i++) {
    const art = ARTICLES[i];
    try {
      const doc = await Blog.create(art);
      console.log(`[${i + 1}/5] ✓ Created: "${art.title}" — ID: ${doc._id}`);
    } catch (err) {
      console.error(`[${i + 1}/5] ✗ Failed: "${art.title}" — ${err.message}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(console.error);
