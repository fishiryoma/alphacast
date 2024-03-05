import { BsPlayCircleFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import useApi from "../contexts/useApi";

export default function PlayBtn({ id, epData }) {
  const [playBtn, setPlayBtn] = useState(true);
  const { setNowPlayingEp, nowPlayingEp } = useApi();

  useEffect(() => {
    if (nowPlayingEp.id !== id) setPlayBtn(true);
  }, [nowPlayingEp, id]);

  return (
    <div
      onClick={() => {
        setPlayBtn(!playBtn);
        setNowPlayingEp({ id, epData });
      }}
      style={{ cursor: "pointer" }}
    >
      <BsPlayCircleFill style={{ color: "#FF7F50", fontSize: "3rem" }} />
    </div>
  );
}
