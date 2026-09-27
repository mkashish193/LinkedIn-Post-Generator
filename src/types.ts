export type ActiveView = 'organizer' | 'attendee-view';

export type ToneType = 'professional' | 'grateful' | 'takeaways' | 'casual';

export interface ImageAsset {
  id: string;
  name: string;
  url: string;
  alt: string;
  aspectRatio?: string;
  category: 'keynote' | 'audience' | 'expo' | 'social';
}

export interface AttendeeBroadcast {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
  reposts?: number;
  liked?: boolean;
}

export interface EventCampaign {
  id: string;
  code: string;
  name: string;
  hostOrg: string;
  hostSubtitle: string;
  datesVenue: string;
  sessionDay: string;
  tier: string;
  shareableSlug: string;
  heroImage: string;
  heroImageAlt: string;
  hashtags: string[];
  links: {
    linkedinOrg: string;
    twitterHandle: string;
    portalUrl: string;
  };
  governance: {
    prefillTemplates: boolean;
    enforceBrandGuidelines: boolean;
    autoGenerateBadges: boolean;
  };
  metrics: {
    postsGenerated: number;
    postsGrowth: string;
    reach: string;
    reachDelta: string;
    attendeeRate: string;
    industryMultiplier: string;
    chartPoints: number[];
  };
  hashtagDistribution: {
    tag: string;
    percentage: number;
    color: string;
  }[];
  recentBroadcasts: AttendeeBroadcast[];
  availablePhotos: ImageAsset[];
}

export interface UserProfile {
  name: string;
  headline: string;
  avatar: string;
  org: string;
}

export interface GeneratedPostHistoryItem {
  id: string;
  timestamp: string;
  tone: ToneType;
  content: string;
  photoUrl: string;
  photoName: string;
}
