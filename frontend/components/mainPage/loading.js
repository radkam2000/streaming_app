import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
SwiperCore.use([Navigation, FreeMode, Autoplay]);

export default function LoadingFilms() {
	const howMany = Array.from({ length: 6 });
	return (
		<>
			<Swiper
				modules={[Navigation, FreeMode, Autoplay]}
				spaceBetween={32}
				centeredSlides={true}
				navigation={true}
				loop={true}
				autoplay={{
					delay: 1500,
					disableOnInteraction: false,
				}}
				breakpoints={{
					1600: {
						width: 1600,
						slidesPerView: 5,
					},
					640: {
						width: 640,
						slidesPerView: 3,
					},
					400: {
						width: 400,
						slidesPerView: 1,
					},
				}}
			>
				{howMany.map((_, index) => (
					<SwiperSlide key={index} className="main-slide">
						<Skeleton
							variant="rounded"
							width={300}
							height={320}
							className="bg-grey-200"
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
}
