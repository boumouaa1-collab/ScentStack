export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  excerpt: string;
  readTime: string;
  publishedLabel: string;
  relatedProductId: string;
  coverGifNumber: number;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-organize-your-perfume-collection',
    coverGifNumber: 1,
    title: 'How to Organize Your Perfume Collection (Without It Becoming a Mess)',
    metaTitle: 'How to Organize Your Perfume Collection | Scent Stack',
    metaDescription:
      'A simple system for organizing your perfume collection — from cataloging bottles to tracking what you actually wear. No spreadsheet skills required.',
    keyword: 'how to organize your perfume collection',
    excerpt:
      'A perfume collection grows faster than most people expect. Here is a simple system to catalog it, so you always know what you own and what you actually reach for.',
    readTime: '6 min read',
    publishedLabel: 'Fragrance Organization',
    relatedProductId: 'collector',
    sections: [
      {
        heading: 'Why perfume collections get out of control',
        body: [
          'Most collections do not start as collections. They start with one bottle, then a gift, then a duty-free impulse buy, then a decant swap with a friend. Two years later there is a drawer of bottles you cannot identify by scent alone, several duplicates you forgot you owned, and at least one bottle that has clearly turned.',
          'The problem is not the number of bottles. It is the lack of a system for keeping track of them. Without one, you keep buying fragrances that are almost identical to ones you already have, and the bottles you love the most end up buried behind ones you never reach for.',
        ],
      },
      {
        heading: 'Start with a full inventory',
        body: [
          'Before you organize anything physically, write down what you own. For each bottle, note the brand, the fragrance name, the size, roughly how full it is, and when you bought it. This single step is the one people skip most often, and it is the one that actually changes how you shop and wear fragrance.',
          'You do not need special software for this. A dedicated fragrance tracker — one page per bottle, with fields already built for notes, occasions, and how often you reach for it — is faster than building your own spreadsheet from scratch and far more pleasant to actually use.',
        ],
      },
      {
        heading: 'Group bottles by how you actually use them',
        body: [
          'Once you have a list, group your bottles into simple categories: everyday wear, special occasion, seasonal, and "testing" (anything you are still deciding about). Physically arranging your shelf or drawer to match these categories makes the decision of "what do I wear today" almost automatic instead of a five-minute search.',
          'This is also the point where duplicates and "misses" become obvious. If you have three near-identical vanilla scents and only reach for one, the inventory makes that visible in a way that staring at a shelf never does.',
        ],
      },
      {
        heading: 'Keep a simple wear log',
        body: [
          'The most useful habit in fragrance collecting is also the smallest: jot down what you wore, roughly how it performed, and whether you would reach for it again. After a month, patterns show up on their own — which notes you are drawn to, which bottles are decorative rather than worn, and where your next purchase should actually go.',
          'A short, structured log takes under a minute a day and saves far more money than it costs in effort, simply by making your future purchases more intentional.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-layer-perfume-beginners-guide',
    coverGifNumber: 2,
    title: "How to Layer Perfume: A Beginner's Guide to Scent Layering",
    metaTitle: 'How to Layer Perfume: A Beginner Guide | Scent Stack',
    metaDescription:
      'Learn how to layer perfume the right way — which fragrance families combine well, what order to apply them in, and mistakes to avoid.',
    keyword: 'how to layer perfume',
    excerpt:
      'Fragrance layering can turn two ordinary bottles into something that feels custom-made. Here is how to start without it turning into a muddled mess.',
    readTime: '7 min read',
    publishedLabel: 'Layering & Technique',
    relatedProductId: 'wardrobe',
    sections: [
      {
        heading: 'What fragrance layering actually is',
        body: [
          'Layering means wearing more than one fragrance product at once — usually a scented lotion or oil underneath, and a perfume or eau de toilette on top — so the two blend on your skin into something slightly different from either on its own.',
          'It is not about mixing two perfumes at random and hoping for the best. Good layering pairs scents that share a common note or a similar mood, so the combination feels intentional rather than confusing.',
        ],
      },
      {
        heading: 'Start with fragrance families, not random pairs',
        body: [
          'The easiest entry point is layering within the same family: two warm, woody scents, or two soft, powdery florals. This is far more forgiving than combining opposite families, like a fresh citrus with a heavy oriental, which can easily cancel each other out or clash.',
          'A useful beginner move is layering an unscented or lightly scented body oil under your usual perfume. It extends wear time and softens sharp top notes without changing the character of the fragrance you already know you like.',
        ],
      },
      {
        heading: 'Apply in the right order',
        body: [
          'Layer from lightest to heaviest, and from bottom to top: shower gel or lotion first, then any layering oil, then your perfume last, applied to pulse points where body heat will help it develop. Give each layer a minute to settle before adding the next — spraying everything at once makes it much harder to tell what is actually happening on your skin.',
          'Less is more here. Two light sprays of a layering scent plus your usual amount of perfume is almost always better than doubling up on both.',
        ],
      },
      {
        heading: 'Track what actually works',
        body: [
          'Layering is trial and error, and it is easy to forget a combination that worked beautifully three weeks ago. Keeping a short record of pairings you have tried — what you layered, in what order, and how it wore through the day — turns those happy accidents into a repeatable part of your routine instead of one-off luck.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-find-your-signature-scent',
    coverGifNumber: 3,
    title: 'How to Find Your Signature Scent (Even If Nothing Feels "You" Yet)',
    metaTitle: 'How to Find Your Signature Scent | Scent Stack',
    metaDescription:
      'A step-by-step approach to finding a signature scent that actually feels like you — using notes, families, and honest self-testing instead of guesswork.',
    keyword: 'how to find your signature scent',
    excerpt:
      'A signature scent is not something you stumble into. It is something you narrow down to, once you know what to actually pay attention to.',
    readTime: '6 min read',
    publishedLabel: 'Discovering Your Taste',
    relatedProductId: 'signature',
    sections: [
      {
        heading: 'Forget "iconic" — start with what you already reach for',
        body: [
          'Most advice about signature scents starts with a list of famous perfumes. Skip that. Start instead with the fragrances you already own and actually enjoy wearing, even the ones you consider basic or unoriginal. Look for the pattern: are you consistently drawn to warm and sweet notes, or clean and green ones? That pattern is more useful than any "best of" list.',
        ],
      },
      {
        heading: 'Learn the note families, briefly',
        body: [
          'You do not need to memorize perfumery terminology, but knowing the broad families — floral, woody, oriental/amber, fresh, gourmand — makes shopping dramatically faster. Once you know you gravitate toward amber and woody notes, you can skip an entire wall of fresh aquatics that were never going to work for you.',
        ],
      },
      {
        heading: 'Test on skin, not on paper, and wait',
        body: [
          "A fragrance's top notes are its opening statement, not its final answer. Many perfumes change meaningfully over two to four hours as they dry down. Test on skin, then go about your day, and check in an hour later and again after several hours. A scent that feels perfect in the first ten minutes but disappoints by hour three is not a signature scent — it is a first impression.",
        ],
      },
      {
        heading: 'Give yourself a shortlist, not a single winner',
        body: [
          'Most people who love fragrance end up with two or three "signatures" for different moods rather than one. That is normal, not a failure to commit. Keep notes on each contender — how it opens, how it dries down, and how people react to it — so that when you are ready to buy full size, you are deciding from real information instead of memory alone.',
        ],
      },
    ],
  },
  {
    slug: 'perfume-notes-explained-top-middle-base',
    coverGifNumber: 4,
    title: 'Perfume Notes Explained: Top, Middle, and Base Notes',
    metaTitle: 'Perfume Notes Explained: Top, Middle, Base | Scent Stack',
    metaDescription:
      'A clear, simple explanation of top, middle, and base notes in perfume — what they are, how long each one lasts, and why it matters when you shop.',
    keyword: 'perfume notes explained',
    excerpt:
      "Every perfume is built in three layers. Understanding them takes ten minutes and changes how you shop for fragrance permanently.",
    readTime: '5 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'discovery',
    sections: [
      {
        heading: 'The three-layer structure of a perfume',
        body: [
          'A fragrance is not one flat smell — it is built in three layers, sometimes called the "fragrance pyramid": top notes, middle (or heart) notes, and base notes. Each layer evaporates at a different rate, which is why a perfume can smell noticeably different at 10am, 1pm, and 6pm without you having reapplied anything.',
        ],
      },
      {
        heading: 'Top notes: the first five to fifteen minutes',
        body: [
          'Top notes are light, volatile molecules — usually citrus, light fruits, or fresh herbs — that you smell immediately on application. They are designed to make a strong first impression, but they also evaporate the fastest, which is why judging an entire perfume by its first whiff off the bottle is misleading.',
        ],
      },
      {
        heading: 'Middle notes: the heart of the fragrance',
        body: [
          'Once the top notes fade, usually within 15 to 30 minutes, the middle notes emerge. This is often described as the "heart" of the perfume — florals, spices, and softer fruits that make up the main character of the scent and typically last a couple of hours.',
        ],
      },
      {
        heading: 'Base notes: what lingers on your skin and clothes',
        body: [
          'Base notes are the heaviest, slowest-evaporating molecules — think woods, musk, amber, vanilla, and resins. They appear as the middle notes fade and can last for many hours, which is also why a fragrance you loved in the store might smell different, and often better, by the end of the day.',
          'Knowing this structure means you can read a fragrance description and predict roughly how it will behave, instead of being surprised by how different a perfume smells at 9am versus 9pm.',
        ],
      },
    ],
  },
  {
    slug: 'build-a-fragrance-wardrobe-for-every-season',
    coverGifNumber: 5,
    title: 'How to Build a Fragrance Wardrobe for Every Season',
    metaTitle: 'Build a Fragrance Wardrobe for Every Season | Scent Stack',
    metaDescription:
      'Learn how to build a fragrance wardrobe with the right scent for every season and occasion, instead of one bottle doing all the work year-round.',
    keyword: 'fragrance wardrobe by season',
    excerpt:
      'Wearing the same heavy oriental in July that you wear in December is a common reason a favorite perfume can start to feel wrong. Here is how to plan around it.',
    readTime: '6 min read',
    publishedLabel: 'Fragrance Wardrobe Planning',
    relatedProductId: 'wardrobe',
    sections: [
      {
        heading: 'Why one bottle is rarely enough',
        body: [
          'Temperature and humidity change how a fragrance performs. A rich, heavy amber that feels perfect on a cold evening can feel overwhelming and cloying in summer heat, while a light citrus that is refreshing in July can feel thin and forgettable in winter. A small fragrance wardrobe, built around the seasons, solves this without requiring an enormous collection.',
        ],
      },
      {
        heading: 'Spring and summer: lighter, fresher, less projection',
        body: [
          'Warmer months favor citrus, green, aquatic, and light floral fragrances. Heat amplifies projection, so scents that would be well-balanced in winter can become overpowering in July. This is the season to reach for anything with grapefruit, bergamot, or light florals, and to go easier on heavy vanilla or amber bases.',
        ],
      },
      {
        heading: 'Autumn and winter: richer, warmer, longer-lasting',
        body: [
          'Cold air holds scent close to the skin and mutes projection, which is exactly when heavier notes — amber, spice, woods, vanilla, and warm gourmands — come into their own. These same fragrances often perform beautifully in winter and feel heavy or cloying in summer, which is why seasonal rotation matters more than most people expect.',
        ],
      },
      {
        heading: 'Plan the wardrobe, not just the purchases',
        body: [
          'A fragrance wardrobe works best as a short, deliberate plan: one or two go-to scents per season, plus a couple of occasion-specific bottles for work, evenings out, or special events. Mapping this out once — rather than buying reactively whenever a bottle catches your eye — is what actually prevents the shelf-full-of-duplicates problem most collectors run into.',
        ],
      },
    ],
  },
  {
    slug: 'how-long-does-perfume-last-shelf-life-storage',
    coverGifNumber: 6,
    title: 'How Long Does Perfume Last? Shelf Life and Storage Tips',
    metaTitle: 'How Long Does Perfume Last? Storage Tips | Scent Stack',
    metaDescription:
      "Perfume does expire. Here's how long it typically lasts, the signs a bottle has turned, and how to store your collection so it lasts longer.",
    keyword: 'how long does perfume last',
    excerpt:
      "That bottle in the back of your drawer might not smell the way you remember. Here's how to tell, and how to prevent it going forward.",
    readTime: '5 min read',
    publishedLabel: 'Collection Care',
    relatedProductId: 'collector',
    sections: [
      {
        heading: 'Yes, perfume expires',
        body: [
          'An unopened bottle, stored well, can last three to five years or longer. Once opened, exposure to air, light, and temperature changes speeds up the breakdown of the fragrance oils, meaning most opened bottles are best used within one to three years for the truest version of their scent.',
        ],
      },
      {
        heading: 'Signs a fragrance has turned',
        body: [
          "A perfume that has degraded often smells noticeably sharper, sourer, or more like alcohol than it used to, or the top notes may have disappeared entirely, leaving something flat and one-dimensional. If the liquid has changed color or gone cloudy, that is also a reliable sign it is time to let it go, no matter how full the bottle still is.",
        ],
      },
      {
        heading: 'How to store perfume properly',
        body: [
          'Heat, light, and humidity are the three things that age fragrance fastest. Keep bottles away from direct sunlight and out of bathrooms, where humidity and temperature swing the most. A closed drawer, box, or cabinet in a room-temperature space is far better for longevity than an open vanity tray, however nice it looks.',
          'Keeping bottles in their original boxes when not in daily use also helps, since the box blocks light and adds a layer of insulation against temperature changes.',
        ],
      },
      {
        heading: 'Track purchase dates so nothing gets forgotten',
        body: [
          'The easiest way to avoid wasting money on a bottle that quietly expired is to note the purchase date when you buy it, and check back on older bottles occasionally rather than assuming they will keep indefinitely. A simple collection log makes this a five-second glance instead of a guessing game.',
        ],
      },
    ],
  },
  {
    slug: 'niche-vs-designer-perfume-difference',
    coverGifNumber: 7,
    title: "Niche vs. Designer Perfume: What's Actually Different",
    metaTitle: 'Niche vs Designer Perfume: The Real Difference | Scent Stack',
    metaDescription:
      'Niche and designer perfume are often compared on price alone. Here is what actually differs — concentration, ingredients, distribution, and longevity.',
    keyword: 'niche vs designer perfume',
    excerpt:
      "\"Niche\" gets thrown around as a synonym for \"better,\" but the real differences are more specific — and knowing them helps you spend well in either category.",
    readTime: '6 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'discovery',
    sections: [
      {
        heading: 'It is not really about quality',
        body: [
          'The most common misconception is that niche perfume is automatically higher quality than designer perfume. In reality, both categories range from excellent to forgettable. The real differences are about how a fragrance is made, sold, and positioned, not a guarantee of how good it will smell on you.',
        ],
      },
      {
        heading: 'Distribution and exclusivity',
        body: [
          'Designer perfumes are made to sell at scale, in department stores and airports worldwide, which means formulas are often adjusted to appeal broadly and to control cost at high volume. Niche houses typically produce in smaller batches, sell through fewer retailers, and can afford to use less common or more expensive ingredients because they are not optimizing for mass-market appeal.',
        ],
      },
      {
        heading: 'Concentration and ingredients',
        body: [
          'Niche fragrances more often use higher concentrations of fragrance oil and less common raw materials, which can translate into stronger projection and longer wear — though this varies a great deal by brand and is not a guaranteed rule. Designer fragrances are not inherently "weaker"; many are formulated at eau de parfum strength and perform very well.',
        ],
      },
      {
        heading: 'How to decide where to spend',
        body: [
          'Rather than choosing a category first, decide based on what you actually like on your skin. Sample widely across both, and keep notes on what performed well and what you were drawn to, regardless of price tier. Some of the best value in a collection comes from a well-loved designer scent, and some of the most disappointing purchases are expensive niche bottles bought on reputation alone.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-test-perfume-samples-properly',
    coverGifNumber: 8,
    title: 'How to Test Perfume Samples the Right Way (Without Wasting Money)',
    metaTitle: 'How to Test Perfume Samples Properly | Scent Stack',
    metaDescription:
      'A proper method for testing perfume samples so you actually know how a fragrance wears — instead of guessing from a five-minute sniff in-store.',
    keyword: 'how to test perfume samples',
    excerpt:
      "Sniffing a strip in a store for five seconds tells you almost nothing about how a fragrance will actually wear. Here's a better process.",
    readTime: '5 min read',
    publishedLabel: 'Smart Fragrance Shopping',
    relatedProductId: 'signature',
    sections: [
      {
        heading: 'Never judge from the bottle or a paper strip alone',
        body: [
          'A scent strip shows you the fragrance in isolation, without your skin chemistry, body heat, or the natural oils that change how it develops. A perfume that smells incredible on paper can smell completely different — better or worse — once it is actually on skin for a few hours.',
        ],
      },
      {
        heading: 'One fragrance per test day',
        body: [
          "Testing three or four samples on the same day, on the same wrist, muddles the results. Your nose adjusts quickly and cross-contamination between sprays makes it hard to judge any one fragrance fairly. Test one sample per day, applied to a pulse point, and go about a normal day so you can judge it in real conditions rather than in a quiet room.",
        ],
      },
      {
        heading: 'Check in at three points during the day',
        body: [
          'Note your first impression in the opening minutes, then check again around the two-hour mark once the top notes have faded, and once more toward the end of the day when only the base notes remain. A fragrance you plan to buy full size should hold your interest at all three stages, not just the first.',
        ],
      },
      {
        heading: 'Write it down before you forget',
        body: [
          'After testing five or six samples over a couple of weeks, the details blur together fast. A short note on each — how it opened, how it wore, whether you would buy a full bottle — turns sampling into an actual decision-making process instead of a pleasant but forgettable exercise.',
        ],
      },
    ],
  },
  {
    slug: 'perfume-mistakes-beginners-make',
    coverGifNumber: 9,
    title: '7 Perfume Mistakes Beginners Make (and How to Avoid Them)',
    metaTitle: '7 Perfume Mistakes Beginners Make | Scent Stack',
    metaDescription:
      'The most common perfume mistakes new fragrance collectors make, from over-applying to buying based on top notes alone, and how to fix each one.',
    keyword: 'perfume mistakes beginners make',
    excerpt:
      "Most of the perfume-buying regrets people mention are versions of the same handful of mistakes. Here are the most common ones, and simple fixes.",
    readTime: '6 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'journal',
    sections: [
      {
        heading: '1. Buying based on the top notes alone',
        body: [
          'The opening five minutes of a fragrance are not the whole story. Many disappointing purchases happen because a scent was judged, and bought, entirely on first impression in a store, before the middle and base notes ever had a chance to appear.',
        ],
      },
      {
        heading: '2. Over-applying because you can\'t smell it on yourself',
        body: [
          "This happens to everyone eventually: your nose adjusts to a scent you wear often, so it feels like it has faded when it has not. The fix is discipline, not more product — two to four sprays is enough for most eau de parfums, and if you are unsure, ask someone else rather than reaching for more.",
        ],
      },
      {
        heading: '3. Not testing on skin before buying full size',
        body: [
          "Skin chemistry changes how a fragrance develops. Skipping the skin test and buying based on a bottle sniff or a friend's recommendation is one of the fastest ways to end up with a bottle you rarely wear.",
        ],
      },
      {
        heading: '4. Ignoring the season and occasion',
        body: [
          'A heavy, rich fragrance that performs beautifully in winter can feel completely wrong in summer heat, and vice versa. Buying only one "type" of fragrance regardless of season is a common reason a favorite bottle stops getting worn.',
        ],
      },
      {
        heading: '5–7. Duplicate buying, poor storage, and no records',
        body: [
          "Rounding out the list: buying near-identical scents without realizing it, storing bottles in direct sunlight or a steamy bathroom, and keeping no record of what you own or what you thought of it. All three are solved the same way — a simple, consistent log of your collection that you actually update. It sounds almost too simple to matter, but it is the single habit that prevents the other six mistakes from repeating.",
        ],
      },
    ],
  },
  {
    slug: 'perfume-journal-vs-spreadsheet',
    coverGifNumber: 10,
    title: 'Perfume Journal vs. Spreadsheet: The Best Way to Track Your Collection',
    metaTitle: 'Perfume Journal vs Spreadsheet: Which Is Better? | Scent Stack',
    metaDescription:
      'Comparing a perfume journal to a DIY spreadsheet for tracking your fragrance collection — which one people actually stick with, and why.',
    keyword: 'perfume journal vs spreadsheet',
    excerpt:
      "A spreadsheet sounds like the obvious choice for tracking a collection. In practice, most people abandon it within a month. Here's why, and what works instead.",
    readTime: '5 min read',
    publishedLabel: 'Collection Tracking',
    relatedProductId: 'printable',
    sections: [
      {
        heading: 'The appeal of a spreadsheet',
        body: [
          'A spreadsheet is flexible, free, and searchable, which makes it a reasonable first instinct for anyone who wants to track a growing perfume collection. For a handful of bottles, a simple list of names and dates works fine.',
        ],
      },
      {
        heading: 'Where spreadsheets tend to fall apart',
        body: [
          'The trouble starts once the collection grows past a dozen or so bottles. Building the right columns — notes, occasions, ratings, wear frequency, repurchase decisions — takes real setup time, and most people never get around to it, so the spreadsheet ends up with just names and nothing useful beyond that. Because it lives in a folder rather than somewhere you naturally look, it is also easy to simply forget to update.',
        ],
      },
      {
        heading: 'Why a structured journal tends to stick',
        body: [
          "A dedicated fragrance journal, with the categories already built in, removes the setup work entirely. You are not deciding what to track — you are just filling it in, which lowers the friction enough that people actually keep it up. For those who prefer paper, printing it also creates a physical habit, similar to a planner, that a spreadsheet on a laptop rarely replicates.",
        ],
      },
      {
        heading: 'The honest answer',
        body: [
          'Either format works if you actually use it consistently. The real deciding factor is not spreadsheet versus journal — it is which format you will actually open and fill in a week from now, and a month from now. For most people, a ready-made structure beats a blank spreadsheet, simply because it removes the setup step that causes most trackers to get abandoned in the first place.',
        ],
      },
    ],
  },
  {
    slug: 'perfume-concentrations-explained-parfum-edp-edt-edc',
    title: 'Parfum vs. EDP vs. EDT vs. EDC: What the Labels Actually Mean',
    metaTitle: 'Parfum vs EDP vs EDT vs EDC Explained | Scent Stack',
    metaDescription:
      'A clear breakdown of perfume concentrations — Parfum, Eau de Parfum, Eau de Toilette, and Eau de Cologne — and how to pick the right one for your budget and lifestyle.',
    keyword: 'parfum vs edp vs edt vs edc',
    excerpt:
      'Those letters on the box are not marketing fluff — they tell you exactly how strong, how long-lasting, and how expensive a bottle is likely to be.',
    readTime: '5 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'discovery',
    coverGifNumber: 11,
    sections: [
      {
        heading: 'It all comes down to one number: concentration',
        body: [
          'Every one of these labels describes the same thing — the percentage of actual fragrance oil dissolved in the alcohol-and-water base. More oil means a stronger scent, longer wear, and usually a higher price, because fragrance oil is the most expensive ingredient in the bottle.',
          'Roughly: Parfum (also called Extrait de Parfum) sits around 20–30% oil, Eau de Parfum (EDP) around 15–20%, Eau de Toilette (EDT) around 5–15%, and Eau de Cologne (EDC) around 2–4%. These ranges vary by brand, but the order never changes.',
        ],
      },
      {
        heading: 'What that actually means on your skin',
        body: [
          'A Parfum will often last 8 hours or more from just two sprays, project less loudly, and feel richer and warmer, since lower alcohol content lets the base notes come through earlier. An EDT, by contrast, is lighter, fresher, and fades faster, which is exactly why it is the default format for citrus and aquatic scents meant to feel breezy rather than heavy.',
          'Neither is "better" in general. A Parfum wasted on a scent designed to be light and fleeting can feel cloying, while an EDT of a rich oriental can disappear within two hours. The format should match the character of the scent, not just your budget.',
        ],
      },
      {
        heading: 'Which one should you actually buy?',
        body: [
          'If you are trying a new scent family for the first time, start with an EDT or EDP sample before committing to a full Parfum bottle — you are paying a premium for concentration, and it is wasted if the scent itself is not the right fit. If you already know you love a fragrance and wear it often, the math usually favors the higher concentration: you use less product per wear, so a Parfum can actually last longer in real-world cost-per-wear than a cheaper EDT you have to reapply three times a day.',
          'A quick way to keep this straight once you start building a collection: log each bottle with its concentration alongside the brand and name. It sounds minor, but "which version do I actually own" is one of the most common things people forget once a collection passes ten bottles.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-make-perfume-last-longer-on-skin',
    title: 'How to Make Perfume Last Longer on Skin (Without Buying a New Bottle)',
    metaTitle: 'How to Make Perfume Last Longer | Scent Stack',
    metaDescription:
      'Practical, tested ways to make your perfume last longer on skin — from application spots to moisturizing technique — without needing a stronger (or pricier) bottle.',
    keyword: 'how to make perfume last longer',
    excerpt:
      "Before you blame the bottle for fading fast, check your routine. Most longevity problems come down to technique, not the fragrance itself.",
    readTime: '5 min read',
    publishedLabel: 'Application & Technique',
    relatedProductId: 'journal',
    coverGifNumber: 12,
    sections: [
      {
        heading: 'Moisturized skin holds scent — dry skin does not',
        body: [
          'Fragrance molecules bind to moisture and oil far better than they bind to dry skin, which is exactly why the same perfume wears differently in summer humidity versus winter dryness. An unscented, fragrance-free lotion applied right before you spray gives the scent something to hold onto, often adding one to two hours of wear with zero change to the perfume itself.',
        ],
      },
      {
        heading: 'Target pulse points, not clothing',
        body: [
          'Wrists, the inner elbow, behind the ears, and the base of the throat run warmer than the rest of your skin, and that heat helps the fragrance diffuse throughout the day. Spraying onto clothing instead can trap top notes in fabric without ever letting the scent develop properly, and some fragrances can stain light-colored fabric.',
          'Resist the urge to rub your wrists together after spraying. It is a reflex, but it breaks down the top-note structure and can make a fragrance smell "off" or more muted than it is meant to.',
        ],
      },
      {
        heading: 'Spray from the right distance, at the right time',
        body: [
          'Hold the bottle 5–7 centimeters from skin rather than spraying directly against it — this gives a more even mist instead of a concentrated wet patch that evaporates unevenly. Applying right after a shower, while pores are slightly open and skin is still a little damp, also tends to extend wear compared to spraying onto fully dry, cool skin later in the day.',
        ],
      },
      {
        heading: 'If it still fades fast, it might be the fragrance family',
        body: [
          'Citrus and light aquatic top notes are simply more volatile by chemistry — they are built to be bright and short-lived, and no amount of technique turns them into an all-day scent. If longevity matters more to you than a specific scent profile, look toward woody, amber, or gourmand bases, which naturally cling to skin longer. Tracking how long each fragrance in your collection actually lasts — rather than trusting memory — makes it much easier to notice this pattern and shop accordingly next time.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-choose-a-fragrance-gift',
    title: 'How to Choose a Fragrance Gift for Someone Else (Without Guessing Wrong)',
    metaTitle: 'How to Choose a Perfume Gift | Scent Stack',
    metaDescription:
      'A practical approach to buying perfume as a gift — what to actually pay attention to about the person, and the safest bets when you are not sure.',
    keyword: 'how to choose a perfume gift',
    excerpt:
      "Buying perfume for someone else feels risky because scent is so personal. Here is how to narrow it down without just guessing.",
    readTime: '5 min read',
    publishedLabel: 'Gifting Guide',
    relatedProductId: 'printable',
    coverGifNumber: 2,
    sections: [
      {
        heading: 'Do not buy their favorite public figure\'s fragrance as a shortcut',
        body: [
          'A celebrity or brand-name release might be a safe-feeling default, but "popular" and "right for this person" are not the same thing. If you have ever heard them describe a scent as "too sweet," "too strong," or "too clean," that single comment is worth more than any bestseller list.',
        ],
      },
      {
        heading: 'Pay attention to what they already wear and own',
        body: [
          'Before buying, check what is already in their bathroom or on their dresser, if you reasonably can. People tend to repeat patterns — if every bottle they own leans warm and spicy, a bright citrus gift will likely sit unused, no matter how well-reviewed it is. If you genuinely cannot find a pattern, their clothing style and favorite candles are a decent secondary clue: bold vs. minimalist dressers, and sweet vs. earthy candle preferences, both loosely map to fragrance taste.',
        ],
      },
      {
        heading: 'When in doubt, go smaller and safer',
        body: [
          'If you are genuinely unsure, a full-size bottle is the wrong gift. A travel size or a curated discovery set lets them actually try something new without the pressure (or cost) of a 100ml commitment they might not love. This also works well for a new relationship or early-stage friendship, where you do not yet have years of data on their taste.',
          'A gift card to a fragrance retailer is a perfectly fine option too, and far better than a confident wrong guess — but if you want something that feels more personal than a gift card without the risk of a bottle they will not wear, a guided tool that helps them discover notes and families they actually like makes a thoughtful middle ground.',
        ],
      },
      {
        heading: 'The safest bets, if you have zero information',
        body: [
          'With truly no clues to go on, lean toward universally wearable, moderate-intensity scents: a clean woody or a soft musk reads as inoffensive and pleasant to most noses, in a way that a bold oud or an intense gourmand does not. It will rarely be anyone\'s all-time favorite, but it is also very unlikely to end up regifted.',
        ],
      },
    ],
  },
  {
    slug: 'fragrance-families-explained-floral-woody-oriental-fresh',
    title: 'Fragrance Families Explained: Floral, Woody, Oriental, Fresh',
    metaTitle: 'Fragrance Families Explained | Scent Stack',
    metaDescription:
      'A clear guide to the four main fragrance families — Floral, Woody, Oriental, and Fresh — and how knowing yours makes every future perfume purchase easier.',
    keyword: 'fragrance families explained',
    excerpt:
      'Before you learn individual notes, learn the family they belong to. It is the fastest way to stop buying perfumes you end up never wearing.',
    readTime: '5 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'discovery',
    coverGifNumber: 3,
    sections: [
      {
        heading: 'Why families matter more than individual notes at first',
        body: [
          'A fragrance can list a dozen individual notes, but the overall impression almost always falls into one dominant family. Learning to recognize the family first — before memorizing specific notes like "bergamot" or "oud" — is the single fastest way to predict whether you will actually like a new perfume before you buy it.',
          'Most classification systems group scents into four broad families: Floral, Woody, Oriental (sometimes called Amber), and Fresh. Many perfumes blend two families together, but one almost always leads.',
        ],
      },
      {
        heading: 'Floral and Fresh: the lighter end',
        body: [
          'Floral fragrances center on flower notes — rose, jasmine, lily of the valley, peony — and range from soft and powdery to bold and heady. They tend to read as classic, romantic, and versatile for daytime wear.',
          'Fresh fragrances cover citrus, aquatic, and green notes. They are built to feel clean and energizing rather than complex, which is why they dominate the "office-safe" and summer categories. If you consistently reach for anything described as "clean" or "crisp," you are a Fresh person before you are anything else.',
        ],
      },
      {
        heading: 'Woody and Oriental: the deeper end',
        body: [
          'Woody fragrances are built around notes like sandalwood, cedar, vetiver, and patchouli. They read as grounded and warm, and tend to last longer on skin than Floral or Fresh scents because woody molecules are naturally heavier and less volatile.',
          'Oriental (Amber) fragrances lean into vanilla, resins, spices, and warm musks. They are the richest, most noticeable family — excellent for cold weather and evening wear, but can feel overwhelming in a small warm room, which is why office environments often ask people to go lighter on these.',
        ],
      },
      {
        heading: 'Finding your family is a pattern, not a guess',
        body: [
          'The easiest way to identify your family is to look backward, not forward: pull up every perfume you currently own and actually enjoy wearing, and check what they have in common. Most people are surprised to find they already lean heavily toward one family without ever naming it. Logging each new fragrance you try against its family — not just its name — turns that pattern into something you can actually shop with, instead of relying on memory at the counter.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-travel-with-perfume-decanting-tsa-rules',
    title: 'How to Travel With Perfume: Decanting, TSA Rules, and What Actually Works',
    metaTitle: 'How to Travel With Perfume (Decanting + TSA Rules) | Scent Stack',
    metaDescription:
      'Everything to know about flying with perfume — TSA liquid limits, how to decant safely without losing scent quality, and what to pack instead of a full bottle.',
    keyword: 'how to travel with perfume',
    excerpt:
      "A full bottle in checked luggage is a real risk. Here is how to actually bring your favorite scent on a trip without breaking a rule or a bottle.",
    readTime: '4 min read',
    publishedLabel: 'Travel & Practical Tips',
    relatedProductId: 'wardrobe',
    coverGifNumber: 4,
    sections: [
      {
        heading: 'TSA liquid rules, specifically for perfume',
        body: [
          'In carry-on luggage, perfume counts as a liquid and must fit the standard 3-1-1 rule: containers of 100ml (3.4oz) or less, all fitting in a single quart-size clear bag. A 100ml bottle itself is allowed even if it is not full — the rule is about the container size, not how much liquid is left inside it.',
          'In checked luggage, there is technically no TSA liquid limit, but airlines and glass bottles do not mix well at altitude and in rough baggage handling. A cracked bottle inside a suitcase is one of the most common travel-perfume complaints for a reason.',
        ],
      },
      {
        heading: 'Decanting into travel atomizers',
        body: [
          'A refillable glass or anodized-aluminum atomizer in the 5–10ml range is the safest way to travel with a signature scent without the weight, fragility, or TSA bag space a full bottle takes up. Avoid cheap plastic atomizers for anything beyond very short trips — some plastics can react with fragrance oils over time and subtly alter the scent.',
          'To decant without losing quality: pour slowly down the inside wall of the new container rather than straight down the center, which limits oxidation from excess agitation, and fill it as close to the top as reasonably possible — less air in the bottle means less oxygen exposure over the length of the trip.',
        ],
      },
      {
        heading: 'Minimize oxidation and heat exposure while traveling',
        body: [
          'Heat and light are what actually degrade perfume over time, not air travel itself. Keep any travel atomizer in your carry-on rather than checked luggage, since cargo holds can reach temperature extremes a cabin never will, and avoid leaving it in a hot car or direct sun once you land.',
        ],
      },
      {
        heading: 'If you are testing something new, travel is a great excuse',
        body: [
          'A trip is a genuinely useful moment to test how a fragrance performs outside your usual climate and routine — humidity, heat, and activity level all change how a scent develops on skin. Packing two or three small decants of different fragrances, rather than committing to one full bottle, gives you real data on which one actually earns a spot in your permanent rotation once you are home.',
        ],
      },
    ],
  },
  {
    slug: 'why-perfume-smells-different-on-everyone-skin-chemistry',
    title: 'Why the Same Perfume Smells Different on Everyone (Skin Chemistry, Explained)',
    metaTitle: 'Why Perfume Smells Different on Everyone | Scent Stack',
    metaDescription:
      'The real reasons the same bottle of perfume smells different from person to person — skin pH, diet, dryness, and why you should always test before buying.',
    keyword: 'why does perfume smell different on skin',
    excerpt:
      "Your friend's bottle smelling amazing on them and underwhelming on you is not in your head. Here is what is actually happening.",
    readTime: '4 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'signature',
    coverGifNumber: 5,
    sections: [
      {
        heading: "It is not just \"skin chemistry\" as one vague thing",
        body: [
          'The phrase gets used as a catch-all, but several distinct, measurable factors combine to create it: skin pH, natural oil production, hydration level, and even diet and medication can all shift how a fragrance\'s molecules evaporate and interact with your skin over the course of a day.',
        ],
      },
      {
        heading: 'Dry skin vs. oily skin changes everything',
        body: [
          'Oilier skin tends to hold fragrance longer and can amplify warmer, richer notes, while drier skin lets top notes fade faster and can make a scent feel thinner overall. This is exactly why the moisturizing-before-spraying technique genuinely works — it is not a myth, it is adjusting the one variable you actually have some control over.',
        ],
      },
      {
        heading: 'pH and body temperature play a real role too',
        body: [
          'Skin pH affects how fragrance molecules break down and project, and naturally runs slightly differently from person to person — and even in different seasons for the same person. Body temperature matters as well: warmer skin diffuses a fragrance\'s molecules into the air faster, which is part of why the same scent can feel bolder on a warm day or during exercise than on a cold one.',
        ],
      },
      {
        heading: 'What this means practically',
        body: [
          'Never trust how a perfume smells only on a paper test strip, and never trust only how it smells on someone else — both skip the one variable that actually matters, which is your own skin. Spray a small amount on your wrist or inner arm, wait at least 20–30 minutes for the alcohol to fully evaporate and the true scent to emerge, and reassess before deciding.',
          'If you keep notes on how specific fragrances actually develop on your own skin over time, you start to notice your own personal pattern — which notes consistently amplify on you and which ones consistently fade fast — and that pattern becomes far more useful for future purchases than any generic review ever will.',
        ],
      },
    ],
  },
  {
    slug: 'layering-perfume-with-lotion-does-it-work',
    title: 'Layering Perfume With Lotion and Body Products: Does It Actually Work?',
    metaTitle: 'Layering Perfume With Lotion — Does It Work? | Scent Stack',
    metaDescription:
      'Does layering a scented lotion under your perfume actually extend wear time, or just muddy the scent? A practical look at what works and what to avoid.',
    keyword: 'layering perfume with lotion',
    excerpt:
      'The advice to "moisturize before you spray" is everywhere. Here is when that actually helps your fragrance, and when it quietly ruins it.',
    readTime: '4 min read',
    publishedLabel: 'Application & Technique',
    relatedProductId: 'journal',
    coverGifNumber: 6,
    sections: [
      {
        heading: 'The theory is sound — but the product you pick matters a lot',
        body: [
          'Moisturized skin genuinely does hold fragrance better, as covered in how skin chemistry affects wear. The problem is not the technique itself, it is reaching for a heavily scented lotion without thinking about whether its scent actually complements the perfume going on top of it.',
        ],
      },
      {
        heading: 'When layering helps',
        body: [
          'An unscented or genuinely fragrance-free lotion is the safest layering base — it hydrates skin without adding a competing scent, which is the entire point. Some brands also release a matching "body lotion" or "body cream" specifically formulated to complement a specific perfume; when available, these are usually a safe, deliberately-tested pairing rather than a guess.',
        ],
      },
      {
        heading: 'When layering backfires',
        body: [
          'A strongly scented lotion from an unrelated product line — think a vanilla-coconut body butter layered under a crisp citrus-aquatic perfume — can muddy both scents into something neither was designed to be. This is the most common layering mistake: people reach for whatever lotion is already in the bathroom rather than considering whether its scent profile actually fits.',
          'If you want to intentionally layer two different scented products to create a custom combination, that is a different (and genuinely fun) practice from basic skin prep — but it deserves its own deliberate testing on skin, the same way you would test any new fragrance, rather than happening by accident every morning.',
        ],
      },
      {
        heading: 'A simple rule to default to',
        body: [
          'If you are not actively trying to build a custom layered scent, keep your moisturizing step fragrance-free and let the perfume itself do all the work. It is the lowest-risk way to get the longevity benefit of moisturized skin without any of the risk of two scents fighting each other by accident.',
        ],
      },
    ],
  },
  {
    slug: 'unisex-perfume-do-masculine-feminine-labels-mean-anything',
    title: 'Unisex Perfume: Do "Masculine" and "Feminine" Labels Actually Mean Anything?',
    metaTitle: 'Unisex Perfume Explained | Scent Stack',
    metaDescription:
      'Where fragrance gender labels actually come from, what they really tell you about a scent, and why wearing "the other side" of the aisle is nothing new.',
    keyword: 'unisex perfume meaning',
    excerpt:
      'Nothing about a floral or a woody note is biologically tied to a gender. Here is where the labels actually come from — and why ignoring them is a completely normal way to shop.',
    readTime: '5 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'signature',
    coverGifNumber: 7,
    sections: [
      {
        heading: 'The labels are marketing history, not chemistry',
        body: [
          'There is no molecule that is inherently "masculine" or "feminine." The gendering of fragrance is largely a 20th-century marketing convention: bright citrus and aquatic notes got packaged and advertised toward men, while florals and sweeter gourmands got packaged toward women, mostly because that made shelf categorization and advertising simpler, not because of any real chemical rule.',
          'Historically it was often the reverse. Rich florals and heavy musks were worn by men in earlier eras, and some of the earliest modern "classic" florals were marketed to everyone before fragrance houses started splitting product lines by gender in the mid-1900s.',
        ],
      },
      {
        heading: 'What the label is actually telling you',
        body: [
          'When a bottle is labeled "for him" or "for her," it is really communicating a composition style the brand associates with that market, not a rule about who can wear it. A "masculine" fragrance tends to lean woody, spicy, or fresh-aquatic; a "feminine" one tends to lean floral or sweet. That is a style description, the same as "bold" or "subtle" — useful shorthand, not a boundary.',
          'Skin chemistry, not gender, is what actually changes how a scent reads on a given person — which is also why the same fragrance can smell different from one wearer to the next regardless of who is wearing it.',
        ],
      },
      {
        heading: 'How to actually shop once you ignore the label',
        body: [
          'Shop by note family and occasion instead of the aisle a bottle is displayed in. If you like a scent on a blotter, that is the only signal that matters. Unisex and "shared" fragrance lines exist specifically because so many people were already crossing those marketing lines on their own — the label caught up to the behavior, not the other way around.',
          'If you are building out a collection, it is worth tracking which note families you actually reach for again and again, independent of how a bottle was marketed. That pattern tells you far more about your taste than any gendered label ever will.',
        ],
      },
    ],
  },
  {
    slug: 'how-many-perfumes-should-you-own-starter-collection',
    title: 'How Many Perfumes Should You Actually Own? Building a Starter Collection',
    metaTitle: 'How Many Perfumes Should You Own | Scent Stack',
    metaDescription:
      'A practical framework for how many bottles actually make sense when you are starting a fragrance collection, and what to buy first.',
    keyword: 'how many perfumes should you own',
    excerpt:
      "There is no magic number, but there is a smarter order to buy in. Here is how to build a small collection that actually gets worn, instead of a shelf of impulse buys.",
    readTime: '4 min read',
    publishedLabel: 'Getting Started',
    relatedProductId: 'discovery',
    coverGifNumber: 8,
    sections: [
      {
        heading: 'Start smaller than you think',
        body: [
          'A genuinely useful starter collection is usually three to five bottles, not the twenty-bottle shelf you see in collector videos. Three to five lets you cover the situations that actually come up — work, going out, warm weather, cold weather — without spending on a scent you will wear twice and forget.',
          'Most people who end up with a drawer of regretted bottles made the same mistake: buying based on a single great moment in a store, rather than against an actual gap in what they already own.',
        ],
      },
      {
        heading: 'Buy for coverage, not duplication',
        body: [
          'The most common beginner mistake is owning five bottles that all smell roughly the same — five different "fresh and clean" scents, for example — because that was the safest category to keep reaching for. A better starter set deliberately covers different territory: one fresh/citrus, one woody or spicy, one floral or gourmand, and maybe one slightly bolder signature scent for occasions that call for it.',
          'If you are not sure what you already lean toward, that is worth figuring out before buying anything else — it is far cheaper to spend an afternoon identifying your actual preferences than to find out by way of a fourth bottle that smells like the other three.',
        ],
      },
      {
        heading: 'When to actually expand past five',
        body: [
          'Grow the collection when you notice a specific gap, not on a schedule. Common real gaps: no cold-weather scent, nothing for formal evenings, nothing that is fully "just for me, home alone" versus "for being seen." Expanding to fill an actual gap tends to produce a collection you wear in full; expanding because a bottle looked nice online tends to produce the opposite.',
        ],
      },
    ],
  },
  {
    slug: 'perfume-oils-vs-sprays-whats-the-difference',
    title: "Perfume Oils vs. Sprays: What's Actually the Difference",
    metaTitle: 'Perfume Oils vs Sprays Explained | Scent Stack',
    metaDescription:
      'How oil-based perfumes (attars) actually differ from alcohol-based sprays — in wear, projection, longevity, and how to apply each one correctly.',
    keyword: 'perfume oil vs spray',
    excerpt:
      "Oils and sprays are not just two bottle formats — they behave completely differently on skin. Here is what actually changes, and which one fits your routine.",
    readTime: '4 min read',
    publishedLabel: 'Fragrance Basics',
    relatedProductId: 'journal',
    coverGifNumber: 9,
    sections: [
      {
        heading: 'The base is the real difference, not the bottle',
        body: [
          'A spray fragrance is dissolved in a denatured alcohol base, which is what carries the scent off the skin and into the air — that is why sprays project further and are easy to apply evenly. A perfume oil (sometimes called an attar) has no alcohol; the fragrance is suspended in a carrier oil, usually jojoba or a similar light oil, which sits closer to the skin instead of evaporating outward.',
        ],
      },
      {
        heading: 'How that changes wear and projection',
        body: [
          'Because alcohol evaporates and oil does not, sprays tend to have a louder, more noticeable opening and then fade in stages as the alcohol carries off the lighter top notes first. Oils skip that loud opening almost entirely — they smell more intimate, warmer, and stay closer to the skin, which is why oils are often described as "skin scents." Oils frequently last just as long as a spray, sometimes longer, but at a much lower volume that only people close to you will notice.',
        ],
      },
      {
        heading: 'Applying each one correctly',
        body: [
          'Sprays are built for a light mist from a few centimeters away — over-spraying does not make a fragrance last longer, it just overwhelms the room. Oils are applied by dabbing, not rubbing, directly onto pulse points; a little goes further than expected since there is no alcohol diluting the concentration.',
          'If you want a fragrance that is noticed across a room, lean toward a spray. If you want something that feels more personal and lasts through a long day without needing a reapply, an oil is usually the better fit — and it is worth noting in a journal which format actually outperforms the other on your own skin, since that varies more by person than most guides admit.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-spot-a-fake-perfume-before-you-buy',
    title: 'How to Spot a Fake Perfume Before You Buy',
    metaTitle: 'How to Spot a Fake Perfume | Scent Stack',
    metaDescription:
      'Practical red flags for counterfeit perfume — packaging, batch codes, pricing, and scent cues — before you hand over your money.',
    keyword: 'how to spot fake perfume',
    excerpt:
      "Counterfeit perfume is a real market, especially online. A few checks before buying can save you from an expensive, unpleasant surprise.",
    readTime: '5 min read',
    publishedLabel: 'Buying Guide',
    relatedProductId: 'collector',
    coverGifNumber: 10,
    sections: [
      {
        heading: 'Price is the first and strongest signal',
        body: [
          'If a bottle is listed well below the price every other retailer sells it at, that is the single biggest red flag, full stop. Legitimate retailers rarely discount recent, popular releases by 40–60%. A steep "deal" on a current bestseller is far more likely to be counterfeit, diluted, or an old, degraded batch than genuine stock someone is offloading out of generosity.',
        ],
      },
      {
        heading: 'Check the batch code before you open it',
        body: [
          'Almost every genuine fragrance bottle has a small engraved or printed batch code, usually on the bottom of the bottle or the base of the box. You can cross-check that code against the brand\'s official site or a batch-code lookup tool — a missing code, a code that does not match the brand\'s format, or a seller who gets evasive when asked for a clear photo of it are all warning signs.',
        ],
      },
      {
        heading: 'Packaging and seal details rarely lie',
        body: [
          'Look closely at the box print quality, font weight, and color accuracy against official product photos — counterfeiters are good at bottles but often slip up on box printing. Cellophane wrapping that is too loose, glued unevenly, or missing the brand\'s usual tamper seal is also worth pausing on. Spray mechanisms that feel flimsy, leak, or produce an uneven mist are a common counterfeit tell as well, since cheap atomizers are one of the easiest parts to cut costs on.',
        ],
      },
      {
        heading: 'Trust your nose, but only as a last check',
        body: [
          'A counterfeit often smells "close but off" — thinner, more alcohol-forward, or missing the development you would expect as it dries down. The problem is that by the time you can smell it, you have usually already paid. That is why price, batch code, and packaging checks matter most: they catch the problem before the sale, not after.',
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
