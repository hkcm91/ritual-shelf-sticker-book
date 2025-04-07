
export interface Theme {
  name: string;
  variables: {
    [key: string]: string;
  };
  textures: {
    shelf: string;
    background: string;
  };
}
