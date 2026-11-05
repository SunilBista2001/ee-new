/**
 * Viewports the homepage must support. Every Playwright project below runs once per entry.
 * `approved` marks the five sizes used in the original visual sign-off of the React build.
 */
export interface Viewport {
  name: string;
  width: number;
  height: number;
  approved?: boolean;
}

export const VIEWPORTS: readonly Viewport[] = [
  { name: '320x740', width: 320, height: 740 },
  { name: '360x800', width: 360, height: 800 },
  { name: '375x812', width: 375, height: 812, approved: true },
  { name: '390x844', width: 390, height: 844 },
  { name: '414x896', width: 414, height: 896 },
  { name: '430x932', width: 430, height: 932 },
  { name: '600x900', width: 600, height: 900 },
  { name: '768x1024', width: 768, height: 1024, approved: true },
  { name: '820x1180', width: 820, height: 1180 },
  { name: '1024x768', width: 1024, height: 768, approved: true },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1440x900', width: 1440, height: 900, approved: true },
  { name: '1600x900', width: 1600, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080, approved: true },
];
