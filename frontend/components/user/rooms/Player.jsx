"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import Skeleton from "@mui/material/Skeleton";
import createWS from "./socket";
import SerieDetails from "./SerieDetails";

const Player = ({ roomId, videoId }) => {
	const ws = useMemo(() => createWS(roomId, videoId), [roomId, videoId]);
	const [currentVideoId, setCurrentVideoId] = useState(null);

	const video = useRef(document.getElementById("video"));
	const [watching, setWatching] = useState(null);
	const HEARTBEAT_TIMEOUT = 1000 * 5 + 1000 * 1; // 5 + 1 second
	const HEARTBEAT_VALUE = 1;

	const sendEvent = (eventType) => (e) => {
		e.preventDefault();
		if (ws) {
			ws.send([eventType, e.target.currentTime]);
		}
	};

	function closeConnection() {
		if (!!ws) {
			ws.close();
		}
	}

	function heartbeat() {
		if (!ws) {
			return;
		} else if (!!ws.pingTimeout) {
			clearTimeout(ws.pingTimeout);
		}

		ws.pingTimeout = setTimeout(() => {
			ws.close();
		}, HEARTBEAT_TIMEOUT);

		const data = new Uint8Array(1);

		data[0] = HEARTBEAT_VALUE;

		ws.send(data);
	}

	ws.addEventListener("open", function (event) {
		console.log("Connected to WS Server");
	});
	ws.addEventListener("message", function (event) {
		if ("string" != typeof event.data) {
			heartbeat();
			return;
		}
		let arrData = event.data.split(",");

		if (arrData[0] === "videoId") {
			setCurrentVideoId(arrData[1]);
		}

		if (arrData[0] === "play") {
			video.current.currentTime = parseFloat(arrData[1]);
			video.current.play();
		}
		if (arrData[0] === "pause") {
			video.current.pause();
		}

		if (arrData[0] === "timeupdate") {
			if (
				video.current.currentTime - arrData[1] > 2 ||
				video.current.currentTime - arrData[1] < -2
			) {
				video.current.currentTime = parseFloat(arrData[1]);
				// video.current.play();
			}
		}
		if (arrData[0] === "watching") {
			console.log(arrData);
			setWatching(arrData[1] - 0);
		}
	});
	const [details, setDetails] = useState(null);
	useEffect(() => {
		const getDetails = async () => {
			const response = await fetch(
				`http://localhost:5000/api/videos/${currentVideoId}/details`,
				{
					method: "GET",
				}
			);
			if (response.status === 200) {
				const res = await response.json();
				setDetails({
					serie: res.data.series_data,
					video: res.data.video_data,
				});
			}
		};
		if (currentVideoId !== null) getDetails();
	}, [currentVideoId, setCurrentVideoId]);

	return (
		<>
			{currentVideoId === null ? (
				<Skeleton
					variant="rectangular"
					width={"full"}
					height={380}
					sx={{ bgcolor: "rgb(64 64 64)" }}
					className="w-full mt-6 h-96"
				/>
			) : (
				<>
					{details && (
						<h1 className="text-2xl font-semibold mt-3">
							{details.serie.series_title}
						</h1>
					)}
					{details && (
						<p className="mt-1 font-medium text-neutral-400">
							{details.video.title}
						</p>
					)}
					<video
						key={currentVideoId}
						id="video"
						ref={video}
						controls
						onPlay={sendEvent("play")}
						onPause={sendEvent("pause")}
						onTimeUpdate={sendEvent("timeupdate")}
						className="w-full mt-6 h-96"
					>
						<source
							src={`http://localhost:5000/api/videos/${currentVideoId}`}
							type="video/mp4"
						/>
					</video>
				</>
			)}
			{watching && (
				<div className="mt-3 flex items-center justify-end gap-2">
					{watching}{" "}
					<Person2OutlinedIcon
						sx={{ fontSize: "20px", path: { color: "#9126d9" } }}
					/>
				</div>
			)}
			{details && (
				<>
					<p className="mt-2 font-medium text-sm text-neutral-400">
						{details.video.desc}
					</p>
					<SerieDetails
						id={details.serie._id}
						epId={details.video._id}
						setCurrentVideoId={setCurrentVideoId}
					/>
				</>
			)}
		</>
	);
};

export default Player;
