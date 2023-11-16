"use client";

import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
	AppBar,
	Avatar,
	Drawer,
	IconButton,
	Menu,
	Toolbar,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Options from "./admin/Options";
import { useAuth } from "@/app/AuthContext";
import ProfileOptions from "./admin/ProfileOptions";
import { usePathname } from "next/navigation";
import UserProfileOptions from "./user/UserProfileOptions";
import UserOptions from "./user/UserOptions";

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const SiteBar = styled(AppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const SiteDrawer = styled(Drawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

const NavMenu = () => {
	const pathname = usePathname();
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const [anchorElUser, setAnchorElUser] = useState(null);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};
	const { logout } = useAuth();
	const handleLogout = () => {
		setAnchorElUser(null);
		logout();
	};
	return (
		<div className="flex">
			<SiteBar
				position="fixed"
				open={open}
				sx={{ backgroundColor: "#101010" }}
			>
				<Toolbar className="relative px-4">
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(open && { display: "none" }),
						}}
					>
						<MenuRoundedIcon
							className="text-32 cursor-pointer"
							sx={{ "&:hover": { path: { color: "#ff9900" } } }}
						/>
					</IconButton>
					<IconButton
						onClick={(event) =>
							setAnchorElUser(event.currentTarget)
						}
						className="cursor-pointer absolute right-8"
					>
						<Avatar alt="admin name" src="/images/poster.webp" />
					</IconButton>
					<Menu
						sx={{ mt: "45px" }}
						id="menu-appbar"
						anchorEl={anchorElUser}
						anchorOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						keepMounted
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						open={Boolean(anchorElUser)}
						onClose={() => setAnchorElUser(null)}
					>
						{pathname.startsWith("/admin") ? (
							<ProfileOptions
								handleLogout={handleLogout}
								setAnchorElUser={setAnchorElUser}
							/>
						) : (
							<UserProfileOptions
								handleLogout={handleLogout}
								setAnchorElUser={setAnchorElUser}
							/>
						)}
					</Menu>
				</Toolbar>
			</SiteBar>
			<SiteDrawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "ltr" ? (
							<ArrowBackIosNewRoundedIcon
								sx={{
									fontSize: "24px",
									"&:hover": { path: { color: "#ff9900" } },
								}}
							/>
						) : (
							<ArrowForwardIosRoundedIcon
								sx={{
									fontSize: "24px",
									"&:hover": { path: { color: "#ff9900" } },
								}}
							/>
						)}
					</IconButton>
				</DrawerHeader>
				{pathname.startsWith("/admin") ? (
					<Options open={open} />
				) : (
					<UserOptions open={open} />
				)}
			</SiteDrawer>
		</div>
	);
};

export default NavMenu;