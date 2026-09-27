import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio_db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag: string;
  active: boolean;
  order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Pre-Weddings' | 'Cinematography' | 'Events' | 'Portraits' | 'Commercial';
  description: string;
  imageUrl: string;
  client?: string;
  year?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
  active: boolean;
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  eventType: string;
  review: string;
  rating: number;
  date: string;
  avatarUrl?: string;
  location: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface Film {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId?: string;
  thumbnail: string;
  category: string;
  description: string;
  clientName?: string;
  duration?: string;
  featured: boolean;
  published: boolean;
  order?: number;
  createdAt?: string;
}

export interface SiteSettings {
  hero: {
    headline: string;
    subheadline: string;
    tagline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    backgroundImageUrl: string;
  };
  about: {
    name: string;
    role: string;
    experienceYears: string;
    introduction: string;
    story: string;
    philosophy: string;
    portraitUrl: string;
    stats: Array<{ label: string; value: string; suffix: string }>;
  };
  highlights: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
  }>;
  featuredStory: {
    title: string;
    subtitle: string;
    location: string;
    description: string;
    fullStory: string;
    imageUrl: string;
    filmDuration?: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    workingHours: string;
    instagram: string;
    youtube: string;
    facebook: string;
    whatsapp: string;
  };
  seo: {
    siteTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
  footer: {
    bio: string;
    copyrightText: string;
  };
}

export interface SessionRecord {
  token: string;
  adminId: string;
  expiresAt: number;
  createdAt: string;
}

export interface DatabaseSchema {
  admins: AdminUser[];
  siteSettings: SiteSettings;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  films: Film[];
  testimonials: TestimonialItem[];
  enquiries: EnquiryItem[];
  sessions: SessionRecord[];
}

const DEFAULT_FILMS: Film[] = [
  {
    id: 'film-1',
    title: 'The Royal Mirage of Udaipur',
    youtubeUrl: 'https://www.youtube.com/watch?v=EngW7tLk6R8',
    youtubeId: 'EngW7tLk6R8',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    category: 'Wedding Films',
    description: 'An ethereal royal Indian destination wedding captured across five days at Jagmandir Island Palace. Meticulously mastered in 4K anamorphic cinema.',
    clientName: 'Aanya & Devendra',
    duration: '04:18',
    featured: true,
    published: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'film-2',
    title: 'Whispers in Cap-d’Antibes',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    youtubeId: 'LXb3EKWsInQ',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
    category: 'Pre-Wedding Films',
    description: 'Mediterranean dusk session along the limestone cliffs of the French Riviera. Raw emotions framed in gentle golden hour light.',
    clientName: 'Nalini & Julian',
    duration: '03:12',
    featured: true,
    published: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'film-3',
    title: 'Silk & Embers — Haute Couture Cut',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
    category: 'Commercial Films',
    description: 'Editorial brand campaign filmed on 35mm cinema glass for the bridal heritage jewelry and haute couture atelier collection.',
    clientName: 'Sabyasachi Heritage Cut',
    duration: '02:45',
    featured: true,
    published: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'film-4',
    title: 'The Midnight Sangeet at Lake Palace',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnail: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=80',
    category: 'Wedding Films',
    description: 'Electric musical celebration and joyous family dances illuminated by thousands of floating candles and royal chandeliers.',
    clientName: 'Kavya & Siddharth',
    duration: '05:30',
    featured: false,
    published: true,
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'film-5',
    title: 'Echoes of Positano',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    youtubeId: 'fJ9rUzIMcZQ',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    category: 'Pre-Wedding Films',
    description: 'A vintage convertible cruise and cliffside sunset vows overlooking the cobalt blue Amalfi waters.',
    clientName: 'Elena & Rohan',
    duration: '03:40',
    featured: false,
    published: true,
    order: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'film-6',
    title: 'Aura of Chronos — Swiss Horology',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    youtubeId: 'L_LUpnjgPso',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
    category: 'Corporate Films',
    description: 'A high-concept macro cinematography short celebrating bespoke mechanical horology and artisan watchmaking.',
    clientName: 'Atelier Aurelia Jewels',
    duration: '01:58',
    featured: false,
    published: true,
    order: 6,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_DATA: DatabaseSchema = {
  admins: [
    {
      id: 'admin_default_1',
      email: 'admin@rishabhsen.com',
      // Bootstrap temporary password: 232323
      passwordHash: bcrypt.hashSync('232323', 10),
      name: 'Rishabh Sen',
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  siteSettings: {
    hero: {
      headline: 'Visual Poetry in Motion & Stillness',
      subheadline: 'Rishabh Sen · Cinematographer & Photographer',
      tagline: 'Crafting timeless cinematic wedding films, editorial imagery, and high-impact visual stories across the globe.',
      primaryCtaText: 'View Portfolio',
      primaryCtaLink: '#portfolio',
      secondaryCtaText: 'Book a Session',
      secondaryCtaLink: '#contact',
      backgroundImageUrl: '',
    },
    about: {
      name: 'Rishabh Sen',
      role: 'Cinematographer & Photographer',
      experienceYears: '11+',
      introduction: 'I document raw human emotion, light, and unspoken connection through an uncompromising cinematic lens.',
      story: 'With over a decade behind cinema cameras, I transitioned from narrative filmmaking into luxury destination weddings and editorial portraiture. My work is informed by 35mm celluloid aesthetics, delicate play of shadows, and an instinct for moments that happen in fractions of a second.',
      philosophy: 'A great photograph or film is never about equipment—it is about stillness in chaos, the breath before a spoken vow, and honoring the dignity of human celebration.',
      portraitUrl: '',
      stats: [
        { label: 'Years Experience', value: '11', suffix: '+' },
        { label: 'Cinematic Projects', value: '380', suffix: '+' },
        { label: 'Happy Clients', value: '520', suffix: '+' },
        { label: 'Destinations Covered', value: '28', suffix: ' Countries' },
      ],
    },
    highlights: [
      {
        id: 'hl-1',
        title: 'Storytelling',
        subtitle: 'Emotional Narrative Architecture',
        description: 'Every project begins with understanding your unique dynamic. We do not shoot templates; we compose intimate, emotionally resonant visual journeys that endure for generations.',
        icon: 'Film',
      },
      {
        id: 'hl-2',
        title: 'Sound & Music',
        subtitle: 'Immersive Acoustic Grading',
        description: 'Cinematography is 50% sound. We record pristine on-location ambient audio, vows, and combine them with bespoke analog musical compositions tailored to each film.',
        icon: 'Volume2',
      },
      {
        id: 'hl-3',
        title: 'Attention to Detail',
        subtitle: 'Sub-Pixel Precision & Light',
        description: 'From the drape of royal fabric to the subtle flicker of candle glow, every frame is meticulously color graded and composed with master painterly precision.',
        icon: 'Sparkles',
      },
    ],
    featuredStory: {
      title: 'The Eternal Mirage of Udaipur',
      subtitle: 'A Royal Destination Wedding Film',
      location: 'Jagmandir Island Palace, Udaipur',
      description: 'Under the amber glow of Rajasthan palace lanterns, Aanya & Devendra exchanged vows surrounded by mirrored pavilions, classical sitar melodies, and the sacred waters of Lake Pichola.',
      fullStory: 'Shot over five immersive days using cinema prime lenses and natural torchlight, this visual symphony captures the monumental scale of Indian royalty alongside tender, unscripted glances. From the vibrant haldi ceremonies bathed in marigold hues to the grand midnight pheras, every frame vibrates with heritage and devotion.',
      imageUrl: '',
      filmDuration: '14 min Cinema Cut',
    },
    contact: {
      email: 'studio@rishabhsen.com',
      phone: '+91 98765 43210',
      location: 'Bandra West, Mumbai · Available Worldwide',
      workingHours: 'Mon - Sat: 10:00 AM – 7:00 PM IST',
      instagram: 'https://instagram.com/rishabhsen_films',
      youtube: 'https://youtube.com/@rishabhsen',
      facebook: 'https://facebook.com/rishabhsenvisuals',
      whatsapp: '+919876543210',
    },
    seo: {
      siteTitle: 'Rishabh Sen – Cinematographer & Photographer | Luxury Visual Stories',
      metaDescription: 'Official portfolio of Rishabh Sen. Premium wedding films, editorial fashion photography, and commercial cinematography based in Mumbai and available worldwide.',
      keywords: 'cinematographer, photographer, luxury wedding film, Rishabh Sen, Mumbai photographer, destination wedding cinematographer',
      ogImage: '',
    },
    footer: {
      bio: 'Master of light, shadow, and emotional documentary. Crafting timeless visual legacies for discerning couples, brands, and editorial productions globally.',
      copyrightText: '© 2026 Rishabh Sen. All rights reserved. Registered Trademark.',
    },
  },
  services: [
    {
      id: 'srv-1',
      title: 'Wedding Photography',
      description: 'Comprehensive candid and fine-art documentary coverage of your celebration with timeless filmic color grading.',
      icon: 'Camera',
      tag: 'Fine Art Documentary',
      active: true,
      order: 1,
    },
    {
      id: 'srv-2',
      title: 'Cinematography',
      description: 'Breathtaking cinema-grade feature wedding films, teaser reels, and audio-mastered heirloom cinema cuts.',
      icon: 'Film',
      tag: '4K Cinema Prime',
      active: true,
      order: 2,
    },
    {
      id: 'srv-3',
      title: 'Pre-Wedding',
      description: 'Intimate, location-scouted love story films and editorial portraits in dream landscapes and heritage palaces.',
      icon: 'Heart',
      tag: 'Editorial Narrative',
      active: true,
      order: 3,
    },
    {
      id: 'srv-4',
      title: 'Events',
      description: 'High-profile celebrations, gala banquets, private milestone anniversaries, and cultural festivals.',
      icon: 'Calendar',
      tag: 'Grand Scale',
      active: true,
      order: 4,
    },
    {
      id: 'srv-5',
      title: 'Maternity',
      description: 'Graceful, high-fashion maternity portraits celebrating new beginnings with gentle, sculptural studio lighting.',
      icon: 'Sun',
      tag: 'Fine Art Studio',
      active: true,
      order: 5,
    },
    {
      id: 'srv-6',
      title: 'Commercial Photography',
      description: 'High-impact campaigns for luxury jewellery, couture apparel, luxury hospitality, and architectural spaces.',
      icon: 'Briefcase',
      tag: 'Brand Campaigns',
      active: true,
      order: 6,
    },
    {
      id: 'srv-7',
      title: 'Fashion Photography',
      description: 'Avant-garde runway and editorial lookbooks published across leading international design publications.',
      icon: 'Sparkles',
      tag: 'Vogue & Harper Aesthetic',
      active: true,
      order: 7,
    },
    {
      id: 'srv-8',
      title: 'Short Films',
      description: 'Scripted narrative shorts, director showreels, music videos, and cinematic brand manifestos.',
      icon: 'Clapperboard',
      tag: 'Narrative Cinema',
      active: true,
      order: 8,
    },
  ],
  portfolio: [
    {
      id: 'port-1',
      title: 'The Palace of Mirrors',
      category: 'Weddings',
      description: 'Royal night pheras illuminated by 500 oil lamps and ancient carved marble columns.',
      imageUrl: '',
      client: 'Kavya & Siddharth',
      year: '2026',
      aspect: 'landscape',
      featured: true,
      active: true,
      order: 1,
    },
    {
      id: 'port-2',
      title: 'Whispers in Cap-d’Antibes',
      category: 'Pre-Weddings',
      description: 'Mediterranean dusk session along the limestone cliffs of the French Riviera.',
      imageUrl: '',
      client: 'Nalini & Julian',
      year: '2025',
      aspect: 'portrait',
      featured: true,
      active: true,
      order: 2,
    },
    {
      id: 'port-3',
      title: 'Shadows of Silk',
      category: 'Cinematography',
      description: 'Behind the anamorphic lens for a luxury haute-couture bridal teaser.',
      imageUrl: '',
      client: 'Sabyasachi Heritage Cut',
      year: '2026',
      aspect: 'landscape',
      featured: true,
      active: true,
      order: 3,
    },
    {
      id: 'port-4',
      title: 'Solitude & Starlight',
      category: 'Portraits',
      description: 'Monochrome 35mm study capturing intimate grace and natural daylight shadows.',
      imageUrl: '',
      client: 'Rhea Kapoor Editorial',
      year: '2025',
      aspect: 'portrait',
      featured: false,
      active: true,
      order: 4,
    },
    {
      id: 'port-5',
      title: 'The Amber Sangeet',
      category: 'Events',
      description: 'Vibrant motion and twirling silks frozen in peak musical euphoria at City Palace.',
      imageUrl: '',
      client: 'Mehta & Singhania Gala',
      year: '2026',
      aspect: 'landscape',
      featured: false,
      active: true,
      order: 5,
    },
    {
      id: 'port-6',
      title: 'Aura of Travertine',
      category: 'Commercial',
      description: 'Architectural campaign for heritage gemstone jewellery and Swiss horology.',
      imageUrl: '',
      client: 'Atelier Aurelia Jewels',
      year: '2026',
      aspect: 'square',
      featured: true,
      active: true,
      order: 6,
    },
    {
      id: 'port-7',
      title: 'Golden Hour at Como',
      category: 'Weddings',
      description: 'Villa Balbianello sunset ceremony framed by olive trees and lakeside mist.',
      imageUrl: '',
      client: 'Elena & Rohan',
      year: '2025',
      aspect: 'portrait',
      featured: false,
      active: true,
      order: 7,
    },
    {
      id: 'port-8',
      title: 'The Silent Script',
      category: 'Cinematography',
      description: 'Award-winning narrative short film about an artisan restorer of ancient frescoes.',
      imageUrl: '',
      client: 'Independent Selection',
      year: '2025',
      aspect: 'landscape',
      featured: false,
      active: true,
      order: 8,
    },
  ],
  testimonials: [
    {
      id: 'tst-1',
      name: 'Priyanka & Arjun Singhal',
      eventType: 'Royal Wedding · Udaipur',
      review: 'Rishabh does not simply film weddings; he captures souls. Watching our film brings tears of joy every single time. His discretion, poise, and painterly eye are unparalleled in the industry.',
      rating: 5,
      date: 'January 2026',
      location: 'Udaipur, Rajasthan',
    },
    {
      id: 'tst-2',
      name: 'Maya & Christian Van Der Berg',
      eventType: 'Destination Pre-Wedding · Amalfi',
      review: 'From our initial consultation to receiving the final gallery, Rishabh treated our story with exceptional reverence. The photos look straight out of Vogue, yet feel 100% authentically us.',
      rating: 5,
      date: 'November 2025',
      location: 'Positano, Italy',
    },
    {
      id: 'tst-3',
      name: 'Aditya Birla Hospitality',
      eventType: 'Commercial Campaign',
      review: 'Rishabh’s mastery of natural ambient light and anamorphic glass transformed our flagship heritage resort showcase. The visual impact exceeded all executive expectations.',
      rating: 5,
      date: 'February 2026',
      location: 'Mumbai, India',
    },
  ],
  enquiries: [
    {
      id: 'enq-sample-1',
      name: 'Tara Khanna',
      email: 'tara.khanna@luxuryweddings.in',
      phone: '+91 99201 12345',
      eventType: 'Wedding Photography & Film',
      eventDate: '2026-12-18',
      message: 'We are planning a 3-day destination wedding at Umaid Bhawan Palace, Jodhpur. We adore your cinematic approach and would love to check your availability and package details.',
      status: 'unread',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'enq-sample-2',
      name: 'Vikram Malhotra',
      email: 'vikram@malhotrahospitality.com',
      phone: '+91 98210 98765',
      eventType: 'Commercial Photography',
      eventDate: '2026-11-05',
      message: 'Looking for a master cinematographer to shoot our upcoming heritage resort architectural campaign and short brand film in Goa.',
      status: 'read',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
  ],
  films: DEFAULT_FILMS,
  sessions: [],
};

// In-memory cache synced with disk
let dbData: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (dbData) return dbData;

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(raw);
      if (dbData) {
        if (!dbData.films) {
          dbData.films = JSON.parse(JSON.stringify(DEFAULT_FILMS));
          saveDb(dbData);
        }
        const defaultAdmin = dbData.admins?.find(
          (a) => a.id === 'admin_default_1' || a.email.toLowerCase() === 'admin@rishabhsen.com'
        );
        if (defaultAdmin && defaultAdmin.mustChangePassword === undefined) {
          defaultAdmin.passwordHash = bcrypt.hashSync('232323', 10);
          defaultAdmin.mustChangePassword = true;
          saveDb(dbData);
        }
        return dbData!;
      }
    }
  } catch (err) {
    console.error('Error reading db file, falling back to defaults:', err);
  }

  dbData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  saveDb(dbData!);
  return dbData!;
}

export function saveDb(data: DatabaseSchema): void {
  dbData = data;
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to write db file:', err);
  }
}
