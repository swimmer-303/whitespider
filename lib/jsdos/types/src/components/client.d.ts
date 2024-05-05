import { Props as PlayerAppProps } from "../player-app";
import { VNode, FunctionComponent } from "preact";

type ClientProps = PlayerAppProps & {
  className?: string;
};

const Client: FunctionComponent<ClientProps> = (props) => {
  // Render function for the `Client` component.
  // ...
};

export default Client;
