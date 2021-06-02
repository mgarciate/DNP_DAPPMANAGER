import React, { useState, useEffect } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { useApi } from "api";
import ClipboardJS from "clipboard";
// Own module
import { rootPath, subPaths, title } from "../../data";
// Components
import Form from "react-bootstrap/esm/Form";
import Card from "components/Card";
import Button from "components/Button";
import QrCode from "components/QrCode";
import Loading from "components/Loading";
import ErrorView from "components/ErrorView";
import Title from "components/Title";
// Icons
import { GoClippy } from "react-icons/go";
import { FaQrcode } from "react-icons/fa";
import { WireguardDeviceCredentials } from "types";
// Utils
import { urlJoin } from "utils/url";

function WireguardDeviceDetailsLoaded({
  id,
  device
}: {
  id: string;
  device: WireguardDeviceCredentials;
}) {
  const [showQr, setShowQr] = useState(false);
  const [showLocalCreds, setShowLocalCreds] = useState(false);
  const config = showLocalCreds ? device.configLocal : device.configRemote;
  const configType = showLocalCreds ? "local" : "remote";

  useEffect(() => {
    // Activate the copy functionality
    new ClipboardJS(".copy-input-copy");
  }, []);

  return (
    <Card className="wireguard-device-settings" spacing>
      <header>
        <h5 className="card-title">{id || "Device not found"}</h5>

        <NavLink to={urlJoin(rootPath, subPaths.wireguard)}>
          <Button>Back</Button>
        </NavLink>
      </header>

      <div className="help-text">
        Use the VPN credentials URL to connect a new device to this DAppNode.
        You can then use the user and admin password to log in to the UI. You
        can share them with a trusted person through a secure channel.
      </div>

      <div className="help-text">
        In case you experience issues connecting from the same network as your
        dappnode, use the local credentials.{" "}
        <span
          className="show-local-credentials"
          onClick={() => setShowLocalCreds(x => !x)}
        >
          {showLocalCreds
            ? "Go back to showing remote credentials"
            : "Show local credentials"}
        </span>
      </div>

      <Form.Group>
        <Form.Label>VPN {configType} credentials URL</Form.Label>
        <div className="credentials-config">{config}</div>
      </Form.Group>

      <div className="buttons">
        <Button data-clipboard-text={config}>
          <span>
            <GoClippy />
            <span>Copy {configType} config</span>
          </span>
        </Button>

        <Button onClick={() => setShowQr(!showQr)}>
          <span>
            <FaQrcode />
            <span>
              {showQr ? "Hide" : "Show"} {configType} config QR code
            </span>
          </span>
        </Button>
      </div>

      {showQr && config && <QrCode url={config} width={"400px"} />}

      <div className="alert alert-secondary" role="alert">
        Beware of shoulder surfing attacks (unsolicited observers), This data
        grants admin access to your DAppNode
      </div>
    </Card>
  );
}

export const WireguardDeviceDetails: React.FC<RouteComponentProps<{
  id: string;
}>> = ({ match }) => {
  const id = match.params.id;
  const device = useApi.wireguardDeviceGet(id);

  return (
    <>
      <Title title={title} subtitle={id} />

      {device.data ? (
        <WireguardDeviceDetailsLoaded id={id} device={device.data} />
      ) : device.error ? (
        <ErrorView error={device.error} />
      ) : device.isValidating ? (
        <Loading steps={["Loading device credentials"]} />
      ) : null}
    </>
  );
};