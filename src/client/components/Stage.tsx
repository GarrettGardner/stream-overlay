import React, { useEffect } from "react";
import { IStageProps } from "../models";
import { MEMES } from "../utils/Memes";
import { MEME_PATH } from "../utils/constants";

export const Stage = (props: IStageProps) => {
  const stopVideo = () => {
    document.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.classList.remove("op--visible");
      video.removeEventListener("ended", stopVideo);
    });
  };

  const playVideo = () => {
    stopVideo();

    const meme = MEMES.find((meme) => meme.id === props.currentMemeId);
    if (!meme) {
      return false;
    }

    const video = document.getElementById(`video-${props.currentMemeId}`) as HTMLVideoElement;
    if (video) {
      video.classList.add("op--visible");
      video.currentTime = 0;
      video.volume = meme.volume / 100;
      video.load();
      video.play();
      video.addEventListener("ended", stopVideo);
    }
  };

  useEffect(() => {
    playVideo();
  }, [props.currentMemeId, props.updated]);

  return (
    <div className="screen screen--stage">
      {MEMES.map((meme, key) => (
        <video key={key} id={`video-${meme.id}`} preload="auto">
          <source src={`${MEME_PATH}${meme.id}.webm`} type="video/webm" />
        </video>
      ))}
    </div>
  );
};
