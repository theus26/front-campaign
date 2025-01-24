export interface IProvider {
  credential: string | null
  name: string
  accounId: string
}

export interface MessageData  {
  type: string;
  message?: string;
  mediatype?: string;
  mimetype?: string;
  caption?: string;
  filename?: string;
  media?: string;
  dataUrl?: string;
}
