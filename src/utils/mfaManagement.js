import axios from 'axios';
import { useState } from 'react';

const Auth0MfaManagement = ({ accessToken }) => {
  const [mfaToken, setMfaToken] = useState(null); // Store MFA token if needed
  const auth0Domain = 'dev-kxqkxff8.us.auth0.com'; // Replace with your Auth0 domain



  // Function to list available MFA mechanisms for a user
  const listAvailableMfaMechanisms = async () => {
    try {
      // The MFA token is obtained during login with MFA
      const response = await axios.get(`https://${auth0Domain}/mfa/challenge`, {
        headers: {
          Authorization: `Bearer ${mfaToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error listing MFA mechanisms:', error);
      throw error;
    }
  };

  // Function to request a new MFA mechanism (challenge)
  const requestNewMfaMechanism = async (challengeType) => {
    try {
      // This endpoint is used to request a challenge based on the challenge type (oob, otp, etc.)
      const response = await axios.post(
        `https://${auth0Domain}/mfa/challenge`,
        {
          challenge_type: challengeType,
          // auth_token is obtained from the MFA-required error when the user logs in
          auth_token: 'YOUR_AUTH_TOKEN',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // Store the MFA token if it is part of the response
      if (response.data.mfa_token) {
        setMfaToken(response.data.mfa_token);
      }
      return response.data;
    } catch (error) {
      console.error('Error requesting new MFA mechanism:', error);
      throw error;
    }
  };

  // Function to remove an MFA mechanism
  const removeMfaMechanism = async (mfaDeviceId) => {
    try {
      // The mfa_token is obtained after the user has authenticated with MFA
      await axios.delete(`https://${auth0Domain}/mfa/associations/${mfaDeviceId}`, {
        headers: {
          Authorization: `Bearer ${mfaToken}`,
        },
      });
      // Handle successful removal here
      console.log(`MFA mechanism with ID: ${mfaDeviceId} removed successfully.`);
    } catch (error) {
      console.error('Error removing MFA mechanism:', error);
      throw error;
    }
  };

  return {
    listAvailableMfaMechanisms,
    requestNewMfaMechanism,
    removeMfaMechanism,
  };
};

const listMfaMechanisms = ({accessToken}) => {
  console.log('accessToken: ', accessToken);
  const auth0Domain = 'dev-kxqkxff8.us.auth0.com'; // Replace with your Auth0 domain
  var options = {
    method: 'GET',
    url: 'https://{auth0Domain}/mfa/authenticators',
    headers: {authorization: accessToken}
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
};

export default listMfaMechanisms;
