import React, { useEffect, useRef, useState } from "react";
import { Stage } from "./Stage";
import { APP_STATUS, IMessage, MEME_PERMISSION, MESSAGE_ROLE, MESSAGE_SOURCE } from "../models";
import { MEMES } from "../utils/Memes";
import { client as tmi } from "tmi.js";
import { TWITCH_USERNAME, TWITCH_CUSTOM_REWARD_ID } from "../utils/constants";

export const App = () => {
  const [status, setStatus] = useState(APP_STATUS.LOADING);
  const [currentMemeId, setCurrentMemeId] = useState("");
  const [lastMessage, setLastMessage] = useState<IMessage>(null);
  const [updated, setUpdated] = useState(0);

  const twitchClient = useRef(
    new tmi({
      options: {
        debug: false,
      },
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [TWITCH_USERNAME],
    })
  );

  useEffect(() => {
    twitchClient.current.connect();

    twitchClient.current.on("connected", () => {
      console.log(`Websocket connection to Twitch opened.`);
      setStatus(APP_STATUS.READY);
    });

    twitchClient.current.on("disconnected", () => {
      console.log(`Websocket connection to Twitch closed.`);
      setStatus(APP_STATUS.ERROR);
    });

    twitchClient.current.on("message", (channel, tags, message, self) => {
      let role = MESSAGE_ROLE.CHATTER;
      if (tags?.badges?.broadcaster) {
        role = MESSAGE_ROLE.BROADCASTER;
      } else if (tags?.mod) {
        role = MESSAGE_ROLE.MOD;
      }

      let source = MESSAGE_SOURCE.CHAT;
      if (tags["custom-reward-id"] && tags["custom-reward-id"] === TWITCH_CUSTOM_REWARD_ID) {
        source = MESSAGE_SOURCE.REWARD;
      }

      let memeId = String(message).trim().toLowerCase();
      if (source === MESSAGE_SOURCE.CHAT) {
        if (memeId.search("!meme ") !== 0) {
          return;
        }
      }
      memeId = memeId.replaceAll("!meme ", "");
      memeId = memeId.replaceAll(" ", "-");

      setLastMessage({
        memeId,
        source,
        role,
      });
    });

    return () => {
      twitchClient.current.disconnect();
    };
  }, []);

  useEffect(() => {
    handleMessage(lastMessage);
  }, [lastMessage]);

  const handleMessage = (message: IMessage) => {
    if (status !== APP_STATUS.READY) {
      return;
    }

    const meme = MEMES.find((meme) => meme.id === message.memeId);
    if (!meme) {
      return;
    }

    if (message.role === MESSAGE_ROLE.CHATTER) {
      if (message.source === MESSAGE_SOURCE.CHAT) {
        return;
      }
      if (meme.permission === MEME_PERMISSION.MODS) {
        return;
      }
    }

    setStatus(APP_STATUS.PLAYING);
    setCurrentMemeId(message.memeId);
    setUpdated(Date.now());

    window.setTimeout(() => {
      setStatus(APP_STATUS.READY);
    }, meme.duration + 1000);
  };

  return (
    <>
      <Stage currentMemeId={currentMemeId} updated={updated} />
      {status === APP_STATUS.LOADING && (
        <div className="screen screen--message">
          <h2>Loading...</h2>
        </div>
      )}
      {status === APP_STATUS.ERROR && (
        <div className="screen screen--error">
          <h2>Error</h2>
        </div>
      )}
    </>
  );
};
