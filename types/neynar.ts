export type User = {
  object: "user";
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
      mentioned_profiles?: User[];
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
  active_status: string;
  power_badge: boolean;
  viewer_context: {
    following: boolean;
    followed_by: boolean;
    blocking: boolean;
    blocked_by: boolean;
    muted: boolean;
  };
};

export type Embed = {
  url?: string;
  cast_id?: {
    fid: number;
    hash: string;
  };
  cast?: {
    object: string;
    hash: string;
    author: User;
    thread_hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    root_parent_url: string | null;
    parent_author: {
      fid: number | null;
    };
    text: string;
    timestamp: string;
    embeds: Embed[];
    channel: Channel | null;
  };
  metadata?: {
    content_type: string;
    content_length: number | null;
    _status: string;
    image?: {
      width_px: number;
      height_px: number;
    };
    video?: {
      streams: Array<{
        height_px: number;
        width_px: number;
        codec_name: string;
      }>;
      duration_s: number;
    };
    html?: {
      ogUrl?: string;
      ogType?: string;
      favicon?: string;
      ogImage?: Array<{
        url: string;
        type?: string;
      }>;
      ogTitle?: string;
      ogLocale?: string;
      ogSiteName?: string;
      ogDescription?: string;
      oembed?: {
        url: string;
        html: string;
        type: string;
        width: number;
        height: number | null;
        method: string;
        version: string;
        cache_age: string;
        author_url: string;
        author_name: string;
        provider_url: string;
        provider_name: string;
      };
    };
  };
};

export type Channel = {
  object: string;
  id: string;
  name: string;
  image_url: string;
  viewer_context?: {
    role?: string;
    following: boolean;
  };
};

export type Reaction = {
  fid: number;
  fname: string;
  display_name: string;
  pfp_url: string;
};

export type Cast = {
  object: "cast";
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string | null;
  root_parent_url: string | null;
  parent_author: {
    fid: number | null;
  };
  author: User;
  text: string;
  timestamp: string;
  embeds: Embed[];
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: Reaction[];
    recasts: Reaction[];
  };
  replies: {
    count: number;
  };
  channel: {
    object: string;
    id: string;
    name: string;
    image_url: string;
  } | null;
  mentioned_profiles: User[];
  viewer_context: {
    liked: boolean;
    recasted: boolean;
  };
  frames?: Frame[];
};

export type ReactionResponse = {
  hash: string;
  target: string;
  type: 'like' | 'recast';
};

export type Frame = {
  version: string;
  title: string;
  image: string;
  image_aspect_ratio: string;
  buttons: {
    index: number;
    title: string;
    action_type: string;
    target: string;
  }[];
  input: {
    text: string;
  };
  state: {
    serialized: string;
  };
  frames_url: string;
  post_url: string;
};
