// Videos shown in the "See it in action" strip on the home page.
//
// HOW TO ADD / CHANGE A VIDEO
//  1. Put the compressed file in  public/videos/   (MP4, H.264 video + AAC audio, e.g. video-1.mp4)
//  2. Put a poster picture (the frame shown before play) next to it  (e.g. video-1.webp or .jpg)
//  3. Add or edit a line below. Order here = order on the site. Delete a line to remove it.
//
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
    id: 'workbook-preview',
    title: 'Inside the Fragrance Discovery Workbook',
    caption: 'A quick flip through the pages of our guided workbook.',
    src: '/productImages/prod1/preview.mp4',
    poster: '/productImages/prod1/poster.webp',
    aspect: 'square',
    uploadDate: '2026-10-01',
  },
  // Add your next two videos here, for example:
  // {
  //   id: 'collection-tracker',
  //   title: 'The Fragrance Collection Tracker',
  //   caption: 'How to catalogue every bottle you own.',
  //   src: '/videos/video-2.mp4',
  //   poster: '/videos/video-2.webp',
  //   aspect: 'landscape',
  //   uploadDate: '2026-10-15',
  // },
];
