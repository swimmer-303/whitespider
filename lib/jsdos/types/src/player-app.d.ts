import { ClientId, DosPlayer, DosPlayerOptionsWithDefaults } from "./player";
import { LatencyInfo } from "./backend/v7/latency";
import { SidebarPage } from "./types";
import { VNode } from "preact";

export type PlayerAppProps<T extends DosPlayer> = {
  player: () => T;
  options: () => DosPlayerOptionsWithDefaults;
  setOnRun: (onRun: () => void) => void;
  // ... other props ...
};

export type PlayerAppReturnType<T extends DosPlayer> = VNode<any> | VNode<any>[];

export function PlayerApp<T extends DosPlayer>(props: PlayerAppProps<T>): PlayerAppReturnType<T> {
  // ... function body ...
}

export type CreatePlayerAppProps<T extends DosPlayer> = {
  root: HTMLDivElement;
  player: T;
  options: DosPlayerOptionsWithDefaults;
  setOnRun: (onRun: () => void) => void;
};

export type CreatePlayerAppReturnType = void;

export function createPlayerApp<T extends DosPlayer>(props: CreatePlayerAppProps<T>): CreatePlayerAppReturnType {
  // ... function body ...
}
