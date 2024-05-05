import { Props as PlayerAppProps } from "../../../player-app";

interface IPxProps {
    arn: string | null;
    setArn: (ipxArn: string | null) => void;
    address: string | null;
    setAddress: (ipxAddress: string | null) => void;
    awaitingAddress: boolean;
    setAwaitingAddress: (waitingIpx: boolean) => void;
    awaitingConnection: boolean;
    setAwaitingConnection: (waitingIpx: boolean) => void;
}

interface TokenProps extends PlayerAppProps {
    ipx: IPxProps;
    update: () => void;
}

declare function TokenConfiguration(props: TokenProps): JSX.Element;

export { TokenConfiguration, TokenProps, IPxProps };
