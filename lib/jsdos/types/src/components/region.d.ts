import { Props as PlayerAppProps } from "../player-app";

export interface RegionProps extends PlayerAppProps {
  className?: string; // changed 'class' to 'className' to follow Preact/React convention
}

export declare function Region(props: RegionProps): JSX.Element | JSX.Element[];

// export {} is not necessary here, so I've removed it
