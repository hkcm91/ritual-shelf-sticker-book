
export interface Theme {
  id: string;
  name: string;
  description: string;
  variables?: Record<string, string | number>;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  textures?: {
    background?: string;
    shelf?: string;
    container?: string;
    header?: string;
  };
  container?: {
    background: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
  };
  shelves?: {
    color: string;
    thickness?: number;
    opacity?: number;
  };
  header?: {
    background: string;
    textColor: string;
    backgroundImage?: string;
  };
  creator?: string;
  tags?: string[];
  isCore?: boolean;
}

export interface CustomTheme extends Theme {
  id: string;
  name: string;
  page: {
    background: string;
    backgroundImage?: string;
  };
  container: {
    background: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
  };
  shelves: {
    color: string;
    thickness?: number;
    opacity?: number;
  };
  header: {
    background: string;
    textColor: string;
    backgroundImage?: string;
  };
}
