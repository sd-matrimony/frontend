import { User } from "lucide-react";
import Image from "next/image";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

type props = {
  image: string
  images: string[]
  profileImg: string
  setAsProfilePic: (url: string) => void
}

function ImageView({ image, images, profileImg, setAsProfilePic }: props) {
  return (
    <Dialog>
      <DialogTrigger render={<Image src={image || "/imgs/user.jpg"} alt={"User Image"} fill className="object-cover rounded-md cursor-pointer border" />} />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">User Image</DialogTitle>
          <DialogDescription className="sr-only">View the selected image in full size.</DialogDescription>
        </DialogHeader>

        <Carousel className="w-full sm:w-[420px] mx-auto">
          <CarouselContent>
            {
              images.map(img => (
                <CarouselItem key={img}>
                  <div>
                    <div className="relative w-full aspect-[3/4]">
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
                        <User className="h-4 w-4" /> Set As Profile Pic
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
