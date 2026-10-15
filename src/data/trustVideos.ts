// Videos shown in the "See it in action" strip on the home page.
//
// HOW TO ADD / CHANGE A VIDEO
//  1. Put the compressed file in  public/videos/   (MP4, H.264 video + AAC audio) named video-1.mp4, video-2.mp4, video-3.mp4
//  2. Put a poster picture (the frame shown before play) next to it: video-1.webp, video-2.webp, video-3.webp
//  3. Add or edit a line below. Order here = order on the site. Delete a line to remove it.
//
// A video whose file is missing is simply left out of the site (no broken box), so you can add them one by one.
// Keep each file small (about 2–8 MB): 720p or 1080p, ~1–3 Mbps. Bigger files slow the page for visitors.

export type TrustVideo = {
  id: string;
  title: string;
  caption: string;
  src: string; // path inside /public, e.g. '/videos/video-1.mp4'
  poster: string; // path inside /public
  aspect: 'landscape' | 'portrait' | 'square';
  uploadDate: string; // YYYY-MM-DD (helps Google show the video in search)
};

export const trustVideosHeading = {
  eyebrow: 'See it in action',
  title: 'A closer look inside Scent Stack',
  subtitle: 'Short walkthroughs so you know exactly what you are getting before you buy.',
};

export const trustVideos: TrustVideo[] = [
  {
    id: 'video-1',
    title: 'Find the scents you love',
    caption: 'The Fragrance Discovery Workbook and Find Your Signature Scent.',
    src: '/videos/video-1.mp4',
    poster: '/videos/video-1.webp',
    aspect: 'portrait',
    uploadDate: '2026-10-20',
  },
  {
    id: 'video-2',
    title: 'Organize your collection',
    caption: 'The Fragrance Collection Tracker and the Fragrance Wardrobe Planner.',
    src: '/videos/video-2.mp4',
    poster: '/videos/video-2.webp',
    aspect: 'landscape',
    uploadDate: '2026-10-20',
  },
  {
    id: 'video-3',
    title: 'Remember what you love',
    caption: 'The Digital Fragrance Journal and the Perfume Journal Printable.',
    src: '/videos/video-3.mp4',
    poster: '/videos/video-3.webp',
    aspect: 'portrait',
    uploadDate: '2026-10-20',
  },
];
