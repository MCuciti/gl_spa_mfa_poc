import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Input,
} from "reactstrap";
import Loading from "../components/Loading";

export const Auth0MfaManagerComponent = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently
  } = useAuth0();
  const auth0Domain = 'dev-kxqkxff8.us.auth0.com';

  const [accessToken, setAccessToken] = useState(null);
  const [mfaResults, setMfaResults] = useState(null);
  const [mfaDeviceIdInput, setMfaDeviceIdInput] = useState("");
  const [addPhoneNumberInput, setAddPhoneNumberInput] = useState("");
  const [bindingCodeInput, setbindingCodeInput] = useState("");
  const [oobCodeFromResponse, setOobCodeFromResponse] = useState("");

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://dev-kxqkxff8.us.auth0.com/mfa/',
            scope: 'enroll read:authenticators remove:authenticators'
          }
        });
        setAccessToken(token);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    if (isAuthenticated) {
      getAccessToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const removeMfaMechanism = async () => {
    if (!accessToken) {
      console.error("Access token not available.");
      return;
    }
    const mfaDeviceId = mfaDeviceIdInput; // Get mfaDeviceId from the input field
    if (!mfaDeviceId) {
      console.error("MFA Device ID is required.");
      return;
    }
    try {
      var options = {
        method: 'DELETE',
        url: `https://${auth0Domain}/mfa/authenticators/${mfaDeviceId}`,
        headers: {authorization: `Bearer ${accessToken}`}
      };
      await axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
      // The mfa_token is obtained after the user has authenticated with MFA
      console.log(`MFA mechanism with ID: ${mfaDeviceId} removed successfully.`);
    } catch (error) {
      console.error("Error removing MFA mechanism:", error);
      // Handle the error gracefully, e.g., show an error message to the user.
    }
  };

  const listMfaMechanisms = async () => {
    if (!accessToken) {
      console.error("Access token not available.");
      return;
    }

    try {
      const options = {
        method: 'GET',
        url: 'https://dev-kxqkxff8.us.auth0.com/mfa/authenticators',
        headers: { authorization: `Bearer ${accessToken}` }
      };
      const response = await axios.request(options);
      console.log(response);
      setMfaResults(response.data);
    } catch (error) {
      console.error("Error listing MFA mechanisms:", error);
    }
  };

  const addMfaMechanismSms = async () => {
    if (!accessToken) {
      console.error("Access token not available.");
      return;
    }
    const phoneNumber = addPhoneNumberInput; // Get mfaDeviceId from the input field
    if (!phoneNumber) {
      console.error("phone number is required.");
      return;
    }
    try {
      var options = {
        method: 'POST',
        url: `https://${auth0Domain}/mfa/associate`,
        headers: {authorization: `Bearer ${accessToken}`, 'content-type': 'application/json'},
        data: {authenticator_types: ['oob'], oob_channels: ['sms'], phone_number: phoneNumber}
      };
      axios.request(options).then(function (response) {
        setOobCodeFromResponse(response.data.oob_code);
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
    } catch (error) {
      console.error("Error adding SMS MFA mechanism:", error);
      // Handle the error gracefully, e.g., show an error message to the user.
    }
  };

  const validateMfaMechanismSms = async () => {
    if (!accessToken) {
      console.error("Access token not available.");
      return;
    }
    const bindingCode = bindingCodeInput // Get bining code from sms message
    const oobCode = oobCodeFromResponse; // Get oobCode from Response
    if (!oobCode) {
      console.error("need validation code for oob!.");
      return;
    }
    try {
      var options = {
        method: 'POST',
        url: `https://${auth0Domain}/oauth/token`,
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
          client_id: `skjd2PTxmc6PCrVrLY0HsYlJ0dHMAcnu`,
          // client_secret: '{yourClientSecret}',
          mfa_token: accessToken,
          oob_code: oobCode,
          binding_code: bindingCode
        })
      }
    } catch (error) {
      console.error("Error adding SMS MFA mechanism:", error);
      // Handle the error gracefully, e.g., show an error message to the user.
    }

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
  };


  return (
    <div className="mb-5">
      <h1 className="mb-5">Auth0 MFA Manager</h1>
      <p className="lead">
        This page demonstrates how to use the Auth0 MFA API to list, add, and remove MFA mechanisms for a user.
      </p>
      <div className="mb-3">
        <Button
          color="primary"
          onClick={() =>
            loginWithRedirect({
              authorizationParams: {
                audience: "https://dev-kxqkxff8.us.auth0.com/mfa/",
                scope: "enroll read:authenticators remove:authenticators",
              },
            })
          }
        >
          Step 1: Get MFA access token
        </Button>
      </div>
      <div className="mb-3">
        <Button color="primary" onClick={listMfaMechanisms}>
          List MFA
        </Button>
      </div>
      <div className="mb-3">
        <Input
          type="text"
          placeholder="Enter MFA Device ID"
          value={mfaDeviceIdInput}
          onChange={(e) => setMfaDeviceIdInput(e.target.value)}
        />
        <Button color="danger" onClick={removeMfaMechanism}>
          Remove MFA Mechanism
        </Button>
        <Input
          type="text"
          placeholder="Enter Phone Number to Enroll"
          value={addPhoneNumberInput}
          onChange={(p) => setAddPhoneNumberInput(p.target.value)}
        />
        <Button color="danger" onClick={addMfaMechanismSms}>
          Add SMS MFA
        </Button>
        <Input
          type="text"
          placeholder="Enter Phone Number challenge code"
          value={bindingCodeInput}
          onChange={(cd) => setbindingCodeInput(cd.target.value)}
        />
        <Button color="danger" onClick={validateMfaMechanismSms}>
          Confirm SMS MFA
        </Button>
      </div>
      {mfaResults && (
        <Card className="mt-5">
          <CardBody>
            <h5>MFA Mechanisms (JSON):</h5>
            <CardText>
              <pre>{JSON.stringify(mfaResults, null, 2)}</pre>
            </CardText>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default withAuthenticationRequired(Auth0MfaManagerComponent, {
  onRedirecting: () => <Loading />,
});
