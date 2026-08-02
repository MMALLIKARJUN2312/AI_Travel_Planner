import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel } from "@/types/trip.types";

export function HotelCards({ hotels }: { hotels: Hotel[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended hotels</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        {hotels.map((hotel) => (
          <div key={hotel.name} className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{hotel.name}</p>
              <Badge variant="outline">{hotel.priceRange}</Badge>
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-3.5 fill-current text-amber-500" />
              {hotel.rating.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">{hotel.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
