import PhotoCarousel from "../PhotoCarousel";

export default function PhotoCarouselExample() {
  const mockPhotos = [
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop",
  ];

  return <PhotoCarousel photos={mockPhotos} autoPlay={true} interval={3000} />;
}
