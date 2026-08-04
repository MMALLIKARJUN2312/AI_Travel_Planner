import Image from "next/image";
import Link from "next/link";

const DESTINATIONS = [
  { name: "Jaipur, India", image: "/images/destination-jaipur.jpg" },
  { name: "Agra, India", image: "/images/destination-agra.jpg" },
  { name: "Goa, India", image: "/images/destination-goa.jpg" },
  { name: "Paris, France", image: "/images/destination-paris.jpg" },
  { name: "Rome, Italy", image: "/images/destination-rome.jpg" },
  { name: "Tokyo, Japan", image: "/images/destination-tokyo.jpg" },
  { name: "Bangkok, Thailand", image: "/images/destination-bangkok.jpg" },
  { name: "New York, USA", image: "/images/destination-newyork.jpg" },
  { name: "Dubai, UAE", image: "/images/destination-dubai.jpg" },
  { name: "Cairo, Egypt", image: "/images/destination-cairo.jpg" },
  { name: "Machu Picchu, Peru", image: "/images/destination-machupicchu.jpg" },
  { name: "Sydney, Australia", image: "/images/destination-sydney.jpg" },
] as const;

export function DestinationGallery() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Popular destinations</h2>
          <p className="mt-2 text-muted-foreground">
            Get a full itinerary and budget breakdown for any of these — or anywhere else in the
            world.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <Link
              key={destination.name}
              href={`/register?destination=${encodeURIComponent(destination.name)}`}
              className="group relative aspect-4/3 overflow-hidden rounded-xl"
            >
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-4 text-base font-medium text-white">
                {destination.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
