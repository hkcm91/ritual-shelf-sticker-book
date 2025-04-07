
export interface PageStyle {
  background: string;
  backgroundImage: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  backgroundAttachment?: string;
}

export interface PageStyleActions {
  updatePageBackground: (color: string) => void;
  updatePageBackgroundImage: (url: string) => void;
  updatePageSetting: (
    property: 'backgroundSize' | 'backgroundRepeat' | 'backgroundPosition' | 'backgroundAttachment',
    value: string
  ) => void;
}
