import { JWT } from "google-auth-library";
import key from "../notes-multiplatfrom-firebase-adminsdk-dgq6z-d3d6ee2b08.json" assert { type: "json" };
import axios from "axios"

export const getAccessToken = () => {
  return new Promise(function (resolve, reject) {
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      ["https://www.googleapis.com/auth/firebase.messaging"],
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
};

export const sendNotif = async (token, { title, body, data, topic }) => {
  const headers = {
    Authorization: "Bearer " + token,
  };
  const payload = {
    validate_only: false,
    message: {
      topic,
      notification: {
        title,
        body,
      },
      data,
    },
  };
  const appId = "notes-multiplatfrom";
  return axios({
    method: "post",
    url: `https://fcm.googleapis.com/v1/projects/${appId}/messages:send`,
    data: payload,
    headers,
  });
};
