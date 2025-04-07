
export interface ContainerStyle {
  background: string;
  backgroundImage: string;
  opacity: number;
  borderWidth: number;
  borderStyle: string;
  borderColor: string;
  borderRadius: number;
  padding: number;
}

export interface ContainerStyleActions {
  updateContainerBackground: (color: string) => void;
  updateContainerBackgroundImage: (url: string) => void;
  updateContainerOpacity: (opacity: number) => void;
  updateContainerBorder: (
    property: 'borderWidth' | 'borderStyle' | 'borderColor' | 'borderRadius',
    value: any
  ) => void;
  updateContainerPadding: (padding: number) => void;
}
