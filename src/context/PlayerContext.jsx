import { createContext, useEffect, useRef, useState, useCallback } from "react";
import { songsData } from "../assets/assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    });

    const play = useCallback(() => {
        audioRef.current.play();
        setPlayStatus(true);
    }, []);

    const pause = useCallback(() => {
        audioRef.current.pause();
        setPlayStatus(false);
    }, []);

    const playWithId = useCallback((id) => {
        setTrack(songsData[id]);
        audioRef.current.play();
        setPlayStatus(true);
    }, []);

    const previous = useCallback(() => {
        const currentIndex = songsData.findIndex(song => song.id === track.id);
        if (currentIndex > 0) {
            setTrack(songsData[currentIndex - 1]);
            audioRef.current.play();
            setPlayStatus(true);
        }
    }, [track]);

    const next = useCallback(() => {
        const currentIndex = songsData.findIndex(song => song.id === track.id);
        if (currentIndex < songsData.length - 1) {
            setTrack(songsData[currentIndex + 1]);
            audioRef.current.play();
            setPlayStatus(true);
        }
    }, [track]);

    const seekSong = useCallback((e) => {
        if (seekBg.current && audioRef.current) {
            audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration);
        }
    }, []);

    useEffect(() => {
        const handleTimeUpdate = () => {
            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
            setTime({
                currentTime: {
                    second: Math.floor(audioRef.current.currentTime % 60),
                    minute: Math.floor(audioRef.current.currentTime / 60)
                },
                totalTime: {
                    second: Math.floor(audioRef.current.duration % 60),
                    minute: Math.floor(audioRef.current.duration / 60)
                }
            });
        };

        if (audioRef.current) {
            audioRef.current.ontimeupdate = handleTimeUpdate;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.ontimeupdate = null;
            }
        };
    }, []);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
}

export default PlayerContextProvider;
