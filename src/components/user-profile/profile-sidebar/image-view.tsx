import { User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@glraj/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@glraj/ui/carousel";
import { Button } from "@glraj/ui/button";

type props = {
  index: number
  images: string[]
  profileImg: string
  setAsProfilePic: (url: string) => void
}

function ImageView({ index, images, profileImg, setAsProfilePic }: props) {
  const t = useTranslations("shared.userProfile.sidebar")

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <Image
            src={images[index] || "/imgs/user.jpg"}
            alt={"User Image"}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            loading={index < 2 ? "eager" : "lazy"}
            className="object-cover rounded-md cursor-pointer border"
          />
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">User Image</DialogTitle>
          <DialogDescription className="sr-only">View the selected image in full size.</DialogDescription>
        </DialogHeader>

        <Carousel opts={{ startIndex: index }} className="w-full sm:w-105 mx-auto">
          <CarouselContent>
            {
              images.map(img => (
                <CarouselItem key={img}>
                  <div>
                    <div className="relative w-full aspect-3/4">
                      <Image
                        fill
                        src={img}
                        alt="Gallery image"
                        className="object-contain"
                      />
                    </div>

                    {
                      profileImg !== img &&
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setAsProfilePic(img)}
                        className="flex mx-auto mt-4"
                      >
                        <User className="h-4 w-4" /> {t("setAsProfilePic")}
                      </Button>
                    }
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}

export default ImageView
