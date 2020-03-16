import React, { useState, useEffect, useContext } from "react"
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl"
import { withStyles } from "@material-ui/core/styles"
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import Context from "../context"
import PinIcon from "./PinIcon"
import Blog from "./Blog"

const INITIAL_VIEWPORT = {
	latitude: 25.761681,
	longitude: -80.191788,
	zoom: 13
}

const Map = ({ classes }) => {
	const { state, dispatch } = useContext(Context)
	const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
	const [userPosition, setUserPosition] = useState(null)

	useEffect(() => {
		getUserPosition()
	}, [])
	const getUserPosition = () => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(position => {
				const { latitude, longitude } = position.coords
				setViewport({ ...viewport, latitude, longitude })
				setUserPosition({ latitude, longitude })
			})
		}
	}

	const handleMapClick = ({ lngLat, leftButton }) => {
		if (!leftButton) return
		if (!state.draft) {
			dispatch({ type: "CREATE_DRAFT" })
		}
		const [longitude, latitude] = lngLat
		dispatch({
			type: "UPDATE_DRAFT_LOCATION",
			payload: { longitude, latitude }
		})
	}

	return (
		<div className={classes.root}>
			<ReactMapGL
				mapboxApiAccessToken="pk.eyJ1Ijoid2tlbm5lZHk4IiwiYSI6ImNrN3UxeTRwYjEzM3czZHAzdTAyOGxmYzgifQ.q_7dU4URRa7wuCg5dSNU6g"
				width="100vw"
				height="calc(100vh - 64px)"
				mapStyle="mapbox://styles/mapbox/streets-v9"
				onViewportChange={newViewport => setViewport(newViewport)}
				{...viewport}
				onClick={handleMapClick}
			>
				<div className={classes.navigationControl}>
					<NavigationControl
						onViewportChange={newViewport => setViewport(newViewport)}
					/>
				</div>
				{/* pin for user position */}
				{userPosition && (
					<Marker
						latitude={userPosition.latitude}
						longitude={userPosition.longitude}
						offsetLeft={-19}
						offsetTop={-37}
					>
						<PinIcon size={40} color="red" />
					</Marker>
				)}

				{state.draft && (
					<Marker
						latitude={state.draft.latitude}
						longitude={state.draft.longitude}
						offsetLeft={-19}
						offsetTop={-37}
					>
						<PinIcon size={40} color="blue" />
					</Marker>
				)}
			</ReactMapGL>
			<Blog />
		</div>
	)
}

const styles = {
	root: {
		display: "flex"
	},
	rootMobile: {
		display: "flex",
		flexDirection: "column-reverse"
	},
	navigationControl: {
		position: "absolute",
		top: 0,
		left: 0,
		margin: "1em"
	},
	deleteIcon: {
		color: "red"
	},
	popupImage: {
		padding: "0.4em",
		height: 200,
		width: 200,
		objectFit: "cover"
	},
	popupTab: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column"
	}
}

export default withStyles(styles)(Map)
