export enum APP_STATUS {
  LOADING = "loading",
  LOAD = "load",
  READY = "ready",
  PLAYING = "playing",
  ERROR = "error",
}

export interface IApp {
  status: APP_STATUS;
  type: string;
  currentMemeId?: string;
}

export interface IChatResponse {
  meme: string;
  role: string;
}

export enum MEME_PERMISSION {
  ALL = "all",
  MODS = "mods",
}

export interface IMeme {
  id: string;
  duration: number;
  permission: MEME_PERMISSION;
  volume: number;
}

export interface IStageProps {
  currentMemeId: string;
  updated: number;
}

export enum MESSAGE_ROLE {
  CHATTER = "chatter",
  MOD = "mod",
  BROADCASTER = "broadcaster",
}

export enum MESSAGE_SOURCE {
  CHAT = "chat",
  REWARD = "reward",
}

export interface IMessage {
  memeId: string;
  role: MESSAGE_ROLE;
  source: MESSAGE_SOURCE;
}
